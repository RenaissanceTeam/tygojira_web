<template>
  <v-container>
    <v-row>
      <v-col
          cols="12"
          sm="6"
      >
        <EmployeeFilteredList v-if="$store.getters.isEmployeeFilterActive"/>
        <EmployeeList v-else/>
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
  import EmployeeFilteredList from "./EmployeeFilteredList";

  export default {
    name: "Employee",
    components: {
      EmployeeFilteredList,
      EmployeeFilterForm,
      EmployeeList
    }
  }
</script>

<style scoped>

</style>