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
        v-on:employee-changed="dialog = false"
    />
  </v-dialog>
</template>

<script>
  import EmployeeInfo from "./EmployeeInfo";
  import {SELECT_EMPLOYEE, UNSELECT_EMPLOYEE} from "../../data/constants/employee_constants";
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
        dialog: false,
        title: `${this.employee.lastName} ${this.employee.firstName} ${this.employee.middleName}`
      }
    },
    watch: {
      dialog: function (open) {
        if (open) {
          this.$store.dispatch(SELECT_EMPLOYEE, this.employee);
        } else {
          this.$store.dispatch(UNSELECT_EMPLOYEE);
        }
      }
    }
  }
</script>

<style scoped>

</style>