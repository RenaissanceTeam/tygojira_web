<template>
  <v-row>
    <v-col cols="12" sm="8">
      <v-card>
        <v-card-title>
          Сотрудники компании
          <v-spacer/>
          <AddEmployeeForm
            class="px-2"
            v-if="isAddEmployeeAllowed"
            v-on:employee-added="refreshCurrentPage"
          />
        </v-card-title>
        <v-card-actions>
          <v-col cols="12" sm="12">
            <v-list>
              <v-divider/>
              <EmployeeItem
                v-for="employee in loadedEmployees"
                v-bind:key="employee.id"
                :employee="employee"
                v-on:employee-deleted="refreshCurrentPage"
              />
            </v-list>
            <v-card-text>
              Всего сотрудников: {{totalEmployees}}
            </v-card-text>

            <v-pagination
              v-model="currentEmployeePage"
              :length="totalEmployeePages"
              @input="employeesPage"
            />
          </v-col>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <EmployeeFilterForm
        v-bind:isFilterActive.sync="isFilterActive"
        v-on:update:isFilterActive="refreshFirstPage"
        v-model="employeeFilter"
      />
    </v-col>
  </v-row>
</template>

<script>
  import {
    GET_EMPLOYEES,
    ADD_EMPLOYEE,
    FILTER_EMPLOYEES
  } from "../../data/constants/employee_constants";
  import EmployeeItem from "./EmployeeItem";
  import AddEmployeeForm from "./AddEmployeeForm";
  import employeeApi from "../../api/employee_api";
  import {Order} from "../../data/dto/pagination_dto";
  import {FullEmployeeInfoDtoFields} from "../../data/dto/employee_dto";
  import {debug, debugError} from "../../utils/logging";
  import EmployeeFilterForm from "./EmployeeFilterForm";

  export default {
    name: "EmployeeList",
    components: {
      EmployeeFilterForm,
      AddEmployeeForm,
      EmployeeItem
    },
    props: {
      employeesPerPage: {
        type: Number,
        default: 13
      },
      employeesOrder: {
        type: String,
        default: Order.ASCENDING
      },
      employeesFieldsOrderBy: {
        type: Array,
        default: function () {
          return [
            FullEmployeeInfoDtoFields.lastName,
            FullEmployeeInfoDtoFields.firstName,
            FullEmployeeInfoDtoFields.middleName
          ]
        }
      }
    },
    data: function () {
      return {
        currentEmployeePage: 0,
        totalEmployeePages: 0,
        loadedEmployees: [],
        totalEmployees: 0,

        isFilterActive: false,
        employeeFilter: {}
      }
    },
    methods: {
      employeesPage: function (page) {
        if (this.isFilterActive) {
          this.filterEmployeesPage(page);
        } else {
          this.allEmployeesPage(page);
        }
      },
      allEmployeesPage: function(page) {
        employeeApi.getEmployees(
          page - 1,
          this.employeesPerPage,
          this.employeesOrder,
          this.employeesFieldsOrderBy
        ).then(response => {
          const employeesPageResponse = response.data;
          debug(GET_EMPLOYEES, "employeesPageResponse:", employeesPageResponse);

          this.loadedEmployees = employeesPageResponse.items;
          this.totalEmployees = employeesPageResponse.totalItems;
          this.currentEmployeePage = employeesPageResponse.currentPage + 1;
          this.totalEmployeePages = employeesPageResponse.totalPages;
        }).catch(err => {
          debugError(GET_EMPLOYEES, err.message, err.response.data.message);
          throw err;
        })
      },
      filterEmployeesPage: function (page) {
        employeeApi.filterEmployees(
          page - 1,
          this.employeesPerPage,
          this.employeesOrder,
          this.employeesFieldsOrderBy,
          this.employeeFilter
        ).then(response => {
          const employeesFilterPageResponse = response.data;
          debug(FILTER_EMPLOYEES, "employeesFilterPageResponse", employeesFilterPageResponse);

          this.loadedEmployees = employeesFilterPageResponse.items;
          this.totalEmployees = employeesFilterPageResponse.totalItems;
          this.currentEmployeePage = employeesFilterPageResponse.currentPage + 1;
          this.totalEmployeePages = employeesFilterPageResponse.totalPages;
        }).catch(err => {
          debugError(FILTER_EMPLOYEES, err.message, err.response.data.message);
          throw err;
        })
      },
      refreshCurrentPage: function () {
        this.employeesPage(this.currentEmployeePage);
      },
      refreshFirstPage: function () {
        this.employeesPage(1);
      }
    },
    computed: {
      isAddEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[ADD_EMPLOYEE];
      }
    },
    beforeMount() {
      this.refreshFirstPage();
    }
  }
</script>

<style scoped>

</style>