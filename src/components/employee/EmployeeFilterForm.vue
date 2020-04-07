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
          <v-autocomplete
            ref="positionautocomplete"
            clearable
            label="Должность"
            :items="employeePositions"
            v-model="position"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-autocomplete
            ref="subdivisionautocomplete"
            v-if="isEmployeeSubdivisionFilterAvailable"
            clearable
            label="Подразделение"
            :items="employeeSubdivisions"
            v-model="subdivision"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <ChipsAutocomplete
            :items="employeeSkills"
            v-model="skills"
            label="Навыки"
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
  import {EmployeeFilter} from "../../data/dto/employee_dto";
  import ChipsAutocomplete from "../custom/autocomplete/ChipsAutocomplete";

  export default {
    name: "EmployeeFilterForm",
    components: {
      ChipsAutocomplete
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
    computed: {
      employeeSkills() {
        return this.$store.getters.employeeSkills;
      },
      employeePositions() {
        return this.$store.getters.employeePositions;
      },
      employeeSubdivisions() {
        return this.$store.getters.employeeSubdivisions;
      },
      isEmployeeSubdivisionFilterAvailable() {
        return this.$store.getters.isProjectOffice;
      }
    },
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
        this.$refs.positionautocomplete.internalSearch = "";
        if (this.isEmployeeSubdivisionFilterAvailable) {
          this.$refs.subdivisionautocomplete.internalSearch = "";
        }
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.position = "";
        this.subdivision = "";
        this.skills = [];
        this.$emit("update:isFilterActive", false);
        this.$emit("input", this.emptyEmployeeFilter());
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