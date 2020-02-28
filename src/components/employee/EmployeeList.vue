<template>
  <v-container>
    <v-card>
      <v-card-title>
        Сотрудники компании
        <v-spacer/>
        <AddEmployeeForm class="px-2" v-if="isAddEmployeeAllowed"/>
      </v-card-title>
      <v-card-actions>
        <v-col cols="12" sm="12">
          <v-list>
            <v-divider/>
            <EmployeeItem
                v-for="employee in employees"
                v-bind:key="hash(employee)"
                :employee="employee"
            />
          </v-list>
          <v-card-text>
            Всего сотрудников: {{totalEmployees}}
          </v-card-text>

          <v-pagination
              v-model="currentEmployeePage"
              :length="totalEmployeePages"
              @input="getNextEmployees"
          />
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import {
    GET_EMPLOYEES,
    SELECT_EMPLOYEE_PAGE,
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
      },
      hash: function (obj) {
        return JSON.stringify(obj);
      }
    },
    mounted() {
      this.getNextEmployees(1);
    },
    computed: {
      currentEmployeePage: {
        get: function () {
          return this.$store.getters.currentEmployeePage;
        },
        set: function (page) {
          this.$store.dispatch(SELECT_EMPLOYEE_PAGE, page);
        }
      },
      totalEmployeePages: function() {
        return this.$store.getters.totalEmployeePages;
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