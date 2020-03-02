<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on }">
      <div>
        <v-list-item link v-on="on">
          <v-list-item-content>
            <v-list-item-title
              v-text="title"
            />
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
      </div>
    </template>
    <EmployeeInfo
      title="Карточка сотрудника"
      v-if="dialog"
      v-model="editableEmployee"
      v-on:employee-deleted="onEmployeeDeleted"
    />
  </v-dialog>
</template>

<script>
  import EmployeeInfo from "./EmployeeInfo";

  export default {
    name: "EmployeeItem",
    components: {EmployeeInfo},
    props: {
      employee: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        editableEmployee: this.employee,
        dialog: false
      }
    },
    computed: {
      title: function () {
        return `${this.editableEmployee.lastName} ${this.editableEmployee.firstName} ${this.editableEmployee.middleName}`;
      }
    },
    methods: {
      onEmployeeDeleted: function () {
        this.dialog = false;
        this.$emit("employee-deleted");
      }
    }
  }
</script>

<style scoped>

</style>