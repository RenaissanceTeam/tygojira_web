<template>
  <v-container>
    <v-card>
      <v-card-title>
        Сотрудники компании
        <AddEmployeeForm class="px-2"/>
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
  import {GET_EMPLOYEES} from "../../data/constants/employee_constants";
  import EmployeeItem from "./EmployeeItem";
  import AddEmployeeForm from "./AddEmployeeForm";

  export default {
    name: "EmployeeList",
    components: {
      AddEmployeeForm,
      EmployeeItem
    },
    data: () => ({
      employeesPerPage: 14,
      currentPage: 0,
      totalEmployees: 0,
      totalPages: 0
    }),
    methods: {
      getNextEmployees: async function (page) {
        await this.$store.dispatch(GET_EMPLOYEES, {page: page - 1, employeesPerPage: this.employeesPerPage})
          .then(employeesPage => {
            this.currentPage = page;
            this.totalPages = employeesPage.totalPages;
            this.totalEmployees = employeesPage.totalItems;
          })
      }
    },
    mounted() {
      this.getNextEmployees(1)
    },
    computed: {
      employees: function () {
        return this.$store.getters.loadedEmployees;
      }
    }
  }
</script>

<style scoped>

</style>