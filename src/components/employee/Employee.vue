<template>
  <v-container>
    <EmployeeList/>
  </v-container>
</template>

<script>
  import EmployeeList from "./EmployeeList";

  export default {
    name: "Employee",
    components: {
      EmployeeList
    }
  }
</script>

<style scoped>

</style>