<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title
              v-text="title"
      />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  export default {
    name: "EmployeeItem",
    props: {
      employee: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        title: `${this.employee.lastName} ${this.employee.firstName} ${this.employee.middleName}`
      }
    }
  }
</script>

<style scoped>

</style>