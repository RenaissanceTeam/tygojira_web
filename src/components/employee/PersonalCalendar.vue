<template>
  <EmployeeCalendar
    :employee-id="callerEmployeeId"
  />
</template>

<script>
  import EmployeeCalendar from "./EmployeeCalendar";

  export default {
    name: "PersonalCalendar",
    components: {EmployeeCalendar},
    data: function () {
      return {
        callerEmployeeId: null
      }
    },
    methods: {
      getCallerEmployeeId() {
        this.callerEmployeeId = this.$store.getters.sessionEmployee.id;
      }
    },
    beforeMount() {
      this.getCallerEmployeeId();
    }
  }
</script>

<style scoped>

</style>