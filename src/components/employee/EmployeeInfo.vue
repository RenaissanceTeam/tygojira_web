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
            {{employee.lastName}} {{employee.firstName}} {{employee.middleName}}
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
              <v-text-field
                  class="centerTextField"
                  dense
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
              <v-text-field
                  class="centerTextField"
                  dense
                  v-model="subdivision"
                  label="Подразделение"
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
              <ChipsCombobox v-model="skills" :readonly="!isEditActive"/>
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
  import ChipsCombobox from "../custom/combobox/ChipsCombobox";
  import {EmployeeWithUpdateEmployeeInfoDto, UpdateEmployeeInfoDto} from "../../data/dto/employee_dto";
  import {debugError} from "../../utils/logging";

  export default {
    components: {ChipsCombobox},
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
    data() {
      return {
        lastName: "",
        firstName: "",
        middleName: "",
        position: "",
        subdivision: "",
        skills: [],
        isEditActive: false
      }
    },
    computed: {
      isDeleteEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[DELETE_EMPLOYEE] && !!this.employee.id;
      },
      isEditEmployeeAllowed: function () {
        return this.$store.getters.employeePermissions[UPDATE_EMPLOYEE] && !!this.employee.id;
      },
      areRequiredFieldsSpecified() {
        const requiredFields = [this.firstName, this.lastName];
        const notSpecified = requiredFields.some(field => !field);
        return !notSpecified;
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
        this.$store.dispatch(UPDATE_EMPLOYEE, new EmployeeWithUpdateEmployeeInfoDto(
          this.employee,
          new UpdateEmployeeInfoDto(
            this.firstName,
            this.middleName,
            this.lastName,
            this.subdivision,
            this.skills,
            this.position
          )
        )).then(() => {
          this.$emit('employee-changed');
        }).catch(err => {
          debugError("EmployeeInfo save", err.message)
        });
      },
      deleteEmployee: function () {
        this.$store.dispatch(DELETE_EMPLOYEE, this.employee)
          .then(() => {
            this.$emit('employee-changed');
          })
      },
      refreshEmployee: function () {
        this.lastName = this.employee.lastName;
        this.firstName = this.employee.firstName;
        this.middleName = this.employee.middleName;
        this.position = this.employee.position;
        this.subdivision = this.employee.subdivision;
        this.skills = [...this.employee.skills];
      },
      required: function (name) {
        return [value => !!value || `${name} required`];
      }
    },
    beforeMount() {
      this.refreshEmployee();
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