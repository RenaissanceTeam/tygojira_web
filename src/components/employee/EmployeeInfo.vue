<template>
  <v-card outlined>
    <v-card-title>
      {{title}}
      <v-spacer/>
      <v-btn
        class="mx-2"
        small
        color="warning"
        v-on:click="edit"
        v-if="isEditEmployeeAllowed && !isEditActive"
      >
        Редактировать
      </v-btn>
      <v-btn
        small
        color="error"
        v-on:click="deleteEmployee"
        v-if="isDeleteEmployeeAllowed"
      >
        Удалить
      </v-btn>
    </v-card-title>
    <v-card-text >
      <v-list dense >
        <v-list-item>
          <v-col cols="0" sm="0">
            <v-icon>mdi-account</v-icon>
          </v-col>

          <v-col cols="2" sm="2" class="subtitle-1">ФИО</v-col>

          <v-divider vertical class="mx-2"/>

          <v-row v-if="isEditActive" dense class="mb-n4">
            <v-col cols="12" sm="10">
              <v-text-field
                class="denseTextField"
                dense
                v-model="lastName"
                label="Фамилия"
                :rules="required('Фамилия')"
                solo
                flat
                :readonly="!isEditActive"
              />
            </v-col>
            <v-col cols="12" sm="10">
              <v-text-field
                class="denseTextField"
                dense
                v-model="firstName"
                label="Имя"
                :rules="required('Имя')"
                solo
                flat
                :readonly="!isEditActive"
              />
            </v-col>
            <v-col cols="12" sm="10">
              <v-text-field
                class="lastDenseTextField"
                dense
                v-model="middleName"
                label="Отчество"
                solo
                flat
                :readonly="!isEditActive"
              />
            </v-col>
          </v-row>

          <v-col v-else class="subtitle-1">
            {{lastName}} {{firstName}} {{middleName}}
          </v-col>
        </v-list-item>

        <v-list-item>
          <v-col cols="0" sm="0">
            <v-icon>mdi-briefcase</v-icon>
          </v-col>

          <v-col cols="2" sm="2" class="subtitle-1">Позиция</v-col>

          <v-divider vertical class="mx-2"/>

          <v-row>
            <v-col cols="12" sm="10">
              <v-autocomplete
                class="centerTextField"
                :items="employeePositions"
                dense
                :append-icon="autocompleteIcon"
                v-model="position"
                label="Позиция"
                solo
                flat
                :readonly="!isEditActive"
              />
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item>
          <v-col cols="0" sm="0">
            <v-icon>mdi-city</v-icon>
          </v-col>

          <v-col cols="2" sm="2" class="subtitle-1">Подразделение</v-col>

          <v-divider vertical class="mx-2"/>

          <v-row>
            <v-col cols="12" sm="10">
              <v-autocomplete
                class="centerTextField"
                dense
                :append-icon="autocompleteIcon"
                v-model="subdivision"
                label="Подразделение"
                :items="employeeSubdivisions"
                solo
                flat
                :readonly="!isEditActive"
              />
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item>
          <v-col cols="0" sm="0">
            <v-icon>mdi-clipboard-text-outline</v-icon>
          </v-col>

          <v-col cols="2" sm="2" class="subtitle-1">Навыки</v-col>

          <v-divider vertical class="mx-2"/>

          <v-row>
            <v-col cols="12" sm="10">
              <ChipsAutocomplete
                v-model="skills"
                :items="employeeSkills"
                :readonly="!isEditActive"
              />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        small
        color="warning"
        v-on:click="cancelEdit"
        v-if="isEditActive"
      >
        Отменить
      </v-btn>
      <v-btn
        class="mx-2"
        small
        color="success"
        v-on:click="save"
        :disabled="!areRequiredFieldsSpecified"
        v-if="isEditActive"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {DELETE_EMPLOYEE, UPDATE_EMPLOYEE} from "../../data/constants/employee_constants";
  import {FullEmployeeInfoDto, UpdateEmployeeInfoDto} from "../../data/dto/employee_dto";
  import {debug, debugError} from "../../utils/logging";
  import employeeApi from "../../api/employee_api";
  import ChipsAutocomplete from "../custom/autocomplete/ChipsAutocomplete";

  export default {
    components: {ChipsAutocomplete},
    props: {
      value: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        default: ""
      }
    },
    name: "EmployeeInfo",
    data() {
      return {
        oldEmployee: this.value,
        lastName: this.value.lastName,
        firstName: this.value.firstName,
        middleName: this.value.middleName,
        position: this.value.position,
        subdivision: this.value.subdivision,
        skills: this.value.skills,
        isEditActive: false
      }
    },
    computed: {
      isDeleteEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[DELETE_EMPLOYEE];
      },
      isEditEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[UPDATE_EMPLOYEE];
      },
      areRequiredFieldsSpecified() {
        const requiredFields = [this.firstName, this.lastName, this.subdivision, this.position];
        const notSpecified = requiredFields.some(field => !field);
        return !notSpecified;
      },
      employeeSkills() {
        return this.$store.getters.employeeSkills;
      },
      employeePositions() {
        return this.$store.getters.employeePositions;
      },
      employeeSubdivisions() {
        return this.$store.getters.employeeSubdivisions;
      },
      autocompleteIcon() {
        return this.isEditActive ? "$dropdown" : "";
      }
    },
    methods: {
      edit: function() {
        this.isEditActive = true;
      },
      cancelEdit: function() {
        this.isEditActive = false;
        this.refreshEmployee();
      },
      save: function () {
        const updateEmployeeInfoDto = new UpdateEmployeeInfoDto(
          this.firstName,
          this.middleName,
          this.lastName,
          this.subdivision,
          this.skills,
          this.position
        );
        employeeApi.updateEmployee(this.value.id, updateEmployeeInfoDto)
          .then(response => {
            const employeeResponse = response.data;
            debug(UPDATE_EMPLOYEE, "employeeResponse", employeeResponse);

            const newEmployee = new FullEmployeeInfoDto(
              employeeResponse.id,
              employeeResponse.firstName,
              employeeResponse.middleName,
              employeeResponse.lastName,
              employeeResponse.position,
              employeeResponse.subdivision,
              employeeResponse.skills
            );
            this.oldEmployee = newEmployee;
            this.isEditActive = false;
            this.$emit("input", newEmployee);
          }).catch(err => {
          debugError(UPDATE_EMPLOYEE, err.message, err.response.data.message);
          throw err;
        });
      },
      deleteEmployee: function () {
        employeeApi.deleteEmployee(this.value.id)
          .then(() => {
            debug(DELETE_EMPLOYEE, "Employee deleted", this.value);
            this.$emit('employee-deleted');
          })
          .catch(err => {
            debugError(DELETE_EMPLOYEE, err.message, err.response.data.message);
            throw err;
          });
      },
      refreshEmployee: function () {
        this.lastName = this.oldEmployee.lastName;
        this.firstName = this.oldEmployee.firstName;
        this.middleName = this.oldEmployee.middleName;
        this.position = this.oldEmployee.position;
        this.subdivision = this.oldEmployee.subdivision;
        this.skills = [...this.getAvailableSkills(this.oldEmployee.skills)];
      },
      required: function (name) {
        return [value => !!value || `${name} required`];
      },
      // ui doesnt show nonexistent skills so they cannot be removed manually
      getAvailableSkills(skills) {
        return skills.filter(skill => this.employeeSkills.includes(skill));
      }
    },
    beforeMount() {
      this.skills = this.getAvailableSkills(this.skills);
    }
  }
</script>

<style scoped>
  .denseTextField {
    margin-top: -10px;
    margin-bottom: -20px;
  }
  .lastDenseTextField {
    margin-top: -10px;
  }
  .centerTextField {
    margin-bottom: -26px;
  }
</style>