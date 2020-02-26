<template>
  <v-container>
    <v-card>
      <v-card-title>
        Сотрудники компании
        <v-spacer/>
        <AddEmployeeForm class="px-2" v-if="isAddEmployeeAllowed"/>
      </v-card-title>
      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="12">
            <v-list>
              <v-divider/>
              <EmployeeItem
                  v-for="employee in employees"
                  v-bind:key="employee.id"
                  :employee="employee"
              />
            </v-list>
            <v-card-text>
              Всего сотрудников: {{totalEmployees}}
            </v-card-text>
          </v-col>

          <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="getNextEmployees"
          />
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import {
    GET_EMPLOYEES,
    SELECT_PAGE,
    ADD_EMPLOYEE
  } from "../../data/constants/employee_constants";
  import EmployeeItem from "./EmployeeItem";
  import AddEmployeeForm from "./AddEmployeeForm";

  export default {
    name: "EmployeeList",
    components: {
      AddEmployeeForm,
      EmployeeItem
    },
    methods: {
      getNextEmployees: function (page) {
        this.$store.dispatch(GET_EMPLOYEES, page);
      }
    },
    mounted() {
      this.getNextEmployees(1)
    },
    computed: {
      currentPage: {
        get: function () {
          return this.$store.getters.currentPage;
        },
        set: function (page) {
          this.$store.dispatch(SELECT_PAGE, page);
        }
      },
      totalPages: function() {
        return this.$store.getters.totalPages;
      },
      employees: function () {
        return this.$store.getters.loadedEmployees;
      },
      isAddEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[ADD_EMPLOYEE];
      },
      totalEmployees: function () {
        return this.$store.getters.totalEmployees;
      }
    }
  }
</script>

<style scoped>

</style>