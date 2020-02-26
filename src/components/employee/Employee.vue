<template>
  <v-container>
    <v-row>
      <v-col
          cols="12"
          sm="6"
      >
        <EmployeeList/>
      </v-col>
      <v-col
          cols="12"
          sm="6"
      >
        <EmployeeFilterForm/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import EmployeeList from "./EmployeeList";
  import EmployeeFilterForm from "./EmployeeFilterForm";

  export default {
    name: "Employee",
    components: {
      EmployeeFilterForm,
      EmployeeList
    }
  }
</script>

<style scoped>

</style>