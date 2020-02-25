<template>
  <v-card outlined>
    <v-card-title>
      {{title}}
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
  export default {
    props: {
      employee: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        default: ""
      }
    },
    name: "EmployeeInfo",
    data: function () {
      return {
        employeeItems: [
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
          },
        ]
      }
    }
  }
</script>

<style scoped>

</style>