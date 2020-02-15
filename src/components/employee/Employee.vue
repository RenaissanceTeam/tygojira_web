<template>
  <div>
    <AddEmployeeForm v-if="isAddEmployeeAllowed"/>
    <EmployeeList/>
  </div>
</template>

<script>
  import EmployeeList from "./EmployeeList";
  import AddEmployeeForm from "./AddEmployeeForm";
  import {ADD_EMPLOYEE} from "../../data/constants/employee_constants";

  export default {
    name: "Employee",
    components: {
      AddEmployeeForm,
      EmployeeList
    },
    computed: {
      isAddEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[ADD_EMPLOYEE]
      }
    }
  }
</script>

<style scoped>

</style>