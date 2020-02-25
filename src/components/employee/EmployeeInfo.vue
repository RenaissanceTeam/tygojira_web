<template>
  <v-card outlined>
    <v-card-title>
      {{title}}
      <v-spacer/>
      <v-btn
          class="justify-center"
          small
          color="error"
          v-on:click="deleteEmployee"
          v-if="isDeleteEmployeeAllowed"
      >
        Удалить
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
            v-for="(item, i) in employeeItems"
            :key="i"
            dense
        >
          <v-col cols="0" sm="0">
            <v-icon>{{ item.icon }}</v-icon>
          </v-col>

          <v-col cols="2" sm="2">
            {{ item.key }}
          </v-col>
          <v-divider vertical class="mx-2"/>

          <v-col>
            {{item.value}}
          </v-col>

        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  import {DELETE_EMPLOYEE} from "../../data/constants/employee_constants";
  import {EMPTY_FULL_EMPLOYEE_INFO_DTO} from "../../data/dto/employee_dto";

  export default {
    props: {
      title: {
        type: String,
        default: ""
      }
    },
    name: "EmployeeInfo",
    data() {
      return {
        employee: EMPTY_FULL_EMPLOYEE_INFO_DTO,
      }
    },
    computed: {
      employeeItems: function () {
        return [
          {
            key: "ФИО",
            value: `${this.employee.lastName} ${this.employee.firstName} ${this.employee.middleName}`,
            icon: "mdi-account"
          },
          {
            key: "Позиция",
            value: this.employee.position,
            icon: "mdi-briefcase"
          },
          {
            key: "Подразделение",
            value: this.employee.subdivision,
            icon: "mdi-city"
          },
          {
            key: "Навыки",
            value: this.employee.skills.join(", "),
            icon: "mdi-clipboard-text-outline"
          }
        ]
      },
      isDeleteEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[DELETE_EMPLOYEE];
      }
    },
    methods: {
      deleteEmployee: function () {
        this.$store.dispatch(DELETE_EMPLOYEE, this.employee)
          .then(() => {
            this.$emit('employee-deleted')
          })
      }
    },
    beforeMount() {
      this.employee = this.$store.getters.selectedEmployee;
    }
  }
</script>

<style scoped>

</style>