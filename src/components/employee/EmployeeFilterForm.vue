<template>
  <v-card>
    <v-card-title>Найти сотрудников</v-card-title>
    <v-card-actions>
      <v-row dense>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Фамилия"
            v-model="lastName"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Имя"
            v-model="firstName"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Отчество"
            v-model="middleName"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-text-field
            label="Должность"
            v-model="position"
          />
        </v-col>
        <v-col cols="12" sm="12">
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
        <v-col cols="12" sm="12" class="text-right">
          <v-btn
            small
            v-on:click="clearFilter"
          >
            Очистить фильтр
          </v-btn>
        </v-col>
        <v-col cols="12" sm="12" class="text-right">
          <v-btn
            color="primary"
            small
            v-on:click="filter"
          >
            Применить фильтр
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import ChipsCombobox from "../custom/combobox/ChipsCombobox";
  import {EmployeeFilter} from "../../data/dto/employee_dto";

  export default {
    name: "EmployeeFilterForm",
    components: {
      ChipsCombobox
    },
    props: {
      value: {
        type: Object
      }
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
        const employeeFilter = new EmployeeFilter(
          this.firstName,
          this.middleName,
          this.lastName,
          this.position,
          this.subdivision,
          this.skills,
          []
        );
        this.$emit("input", employeeFilter);
        this.$emit("update:isFilterActive", true);
      },
      clearFilter: function () {
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.position = "";
        this.subdivision = "";
        this.skills = [];
        this.$emit("update:isFilterActive", false);
        this.$emit("input", this.emptyEmployeeFilter())
      },
      emptyEmployeeFilter: function () {
        return {
          firstName: "",
          middleName: "",
          lastName: "",
          position: "",
          subdivision: "",
          skills: "",
          availableOn: []
        }
      }
    }
  }
</script>

<style scoped>

</style>