<template>
  <div>
    <v-list>
      <EmployeeItem
              v-for="employee in employees"
              v-bind:key="employee.id"
              :employee="employee"
      />
    </v-list>

    <v-pagination
            v-model="currentPage"
            :length="totalPages"
            @input="updateEmployees"
    />
  </div>
</template>

<script>
  import employeeApi from "../../api/employee_api";
  import {Order, PageRequest, Sort} from "../../data/dto/pagination_dto";
  import {FullEmployeeInfoDtoFields} from "../../data/dto/employee_dto";
  import {debug, debugError} from "../../utils/logging";
  import {GET_EMPLOYEES} from "../../data/constants/employee_constants";
  import EmployeeItem from "./EmployeeItem";

  export default {
    name: "EmployeeList",
    components: {
      EmployeeItem
    },
    data: () => ({
      employeesPerPage: 40,
      currentPage: 0,
      totalEmployees: 0,
      totalPages: 0,
      employees: []
    }),
    methods: {
      updateEmployees: async function (page) {
        await employeeApi.getEmployees(new PageRequest(
            page - 1,
            this.employeesPerPage,
            new Sort(Order.ASCENDING, [
                  FullEmployeeInfoDtoFields.lastName,
                  FullEmployeeInfoDtoFields.firstName,
                  FullEmployeeInfoDtoFields.middleName
                ]
            ))
        ).then(response => {
          const employeesPageResponse = response.data;
          debug(GET_EMPLOYEES, "employeesPageResponse:", employeesPageResponse);

          this.currentPage = page;
          this.totalPages = employeesPageResponse.totalPages;
          this.totalEmployees = employeesPageResponse.totalItems;
          this.employees = employeesPageResponse.items;
        }).catch(err => {
          debugError(GET_EMPLOYEES, err.message, err.response.data.message);
        })
      }
    },
    mounted() {
      this.updateEmployees(1)
    }
  }
</script>

<style scoped>

</style>