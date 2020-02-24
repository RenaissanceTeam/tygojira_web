<template>
  <div>
    <v-list-item link>
      <v-list-item-content>
        <v-list-item-title
            v-text="title"
        />
      </v-list-item-content>
    </v-list-item>
    <v-divider/>
  </div>
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