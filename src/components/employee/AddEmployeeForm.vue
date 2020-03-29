<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small color="primary" v-on="on">Добавить</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Введите данные сотрудника</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Фамилия*"
                v-model="lastName"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Имя*"
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
              <v-autocomplete
                ref="position"
                label="Должность*"
                :items="employeePositions"
                v-model="position"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                ref="subdivision"
                label="Подразделение*"
                :items="employeeSubdivisions"
                v-model="subdivision"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <ChipsAutocomplete
                :items="employeeSkills"
                label="Навыки"
                v-model="skills"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Логин*"
                v-model="username"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                :items="allRoles"
                label="Роли*"
                v-model="roles"
                multiple
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" text @click="close">Закрыть</v-btn>
        <v-btn
          color="primary"
          text
          @click="save"
          :disabled="!areRequiredFieldsSpecified"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {ADD_EMPLOYEE, BUSINESS_ROLE} from "../../data/constants/employee_constants";
  import {EmployeeDto, EmployeeWithRoleDto} from "../../data/dto/employee_dto";
  import employeeApi from "../../api/employee_api";
  import {debug, debugError} from "../../utils/logging";
  import ChipsAutocomplete from "../custom/autocomplete/ChipsAutocomplete";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";

  export default {
    name: "AddEmployeeForm",
    components: {ChipsAutocomplete},
    data: () => ({
      dialog: false,
      allRoles: Object.keys(BUSINESS_ROLE),

      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      subdivision: "",
      skills: [],
      username: "",
      roles: []
    }),
    computed: {
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.firstName, this.lastName, this.username, this.subdivision, this.position
        ]);
      },
      employeeSkills() {
        return this.$store.getters.employeeSkills;
      },
      employeePositions() {
        return this.$store.getters.employeePositions;
      },
      employeeSubdivisions() {
        return this.$store.getters.employeeSubdivisions;
      }
    },
    methods: {
      save: async function () {
        const employeeWithRoleDto = new EmployeeWithRoleDto(
          new EmployeeDto(
            this.username,
            this.firstName,
            this.middleName,
            this.lastName,
            this.position,
            this.subdivision,
            this.skills
          ),
          this.roles
        );
        await employeeApi.addEmployee(employeeWithRoleDto)
          .then(response => {
            const employee = response.data;
            debug(ADD_EMPLOYEE, "Employee added", employee);
            this.refreshForm();
            this.$emit('employee-added');
          }).catch(err => {
            debugError(ADD_EMPLOYEE, err.message, err.response.data.message);
            throw err;
          });
      },
      close: function () {
        this.refreshForm();
      },
      refreshForm: function () {
        this.dialog = false;
        this.$refs.subdivision.internalSearch = "";
        this.$refs.position.internalSearch = "";
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.username = "";
        this.position = "";
        this.subdivision = "";
        this.skills = [];
        this.roles = [];
      }
    }
  }
</script>

<style scoped>

</style>