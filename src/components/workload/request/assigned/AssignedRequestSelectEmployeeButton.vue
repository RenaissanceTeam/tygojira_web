<template>
  <v-btn
    small
    color="primary"
    @click="onEmployeeSelected"
  >
    Выбрать
  </v-btn>
</template>

<script>
  export default {
    name: "AssignedRequestSelectEmployeeButton",
    props: {
      employee: {
        type: Object,
        required: true
      }
    },
    methods: {
      onEmployeeSelected() {
        this.$emit("change", this.employee);
      }
    }
  }
</script>

<style scoped>

</style>