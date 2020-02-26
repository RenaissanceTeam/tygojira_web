<template>
  <v-container>
    <v-card>
      <v-card-title>Найти сотрудников</v-card-title>
      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
                label="Фамилия"
                v-model="lastName"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
                label="Имя"
                v-model="firstName"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
                label="Отчество"
                v-model="middleName"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                label="Должность"
                v-model="position"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                label="Подразделение"
                v-model="subdivision"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <ChipsCombobox
                label="Навыки"
                v-model="skills"
            />
          </v-col>
          <v-col cols="12" sm="6" class="text-left">
            <v-btn
              v-on:click="clearFilter"
            >
              Очистить фильтр
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="text-right">
            <v-btn
                color="primary"
                v-on:click="filter"
            >
              Применить фильтр
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import ChipsCombobox from "../custom/combobox/ChipsCombobox";
  import {FILTER_EMPLOYEES, GET_EMPLOYEES} from "../../data/constants/employee_constants";
  import {EmployeeFilter} from "../../data/dto/employee_dto";

  export default {
    name: "EmployeeFilterForm",
    components: {
      ChipsCombobox
    },
    data: () => ({
      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      subdivision: "",
      skills: [],
    }),
    methods: {
      filter: function () {
        this.$store.dispatch(FILTER_EMPLOYEES, new EmployeeFilter(
          this.firstName,
          this.middleName,
          this.lastName,
          this.position,
          this.subdivision,
          this.skills,
          []
        ));
      },
      clearFilter: function () {
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.position = "";
        this.subdivision = "";
        this.skills = [];
        this.$store.dispatch(GET_EMPLOYEES, 1)
      }
    }
  }
</script>

<style scoped>

</style>