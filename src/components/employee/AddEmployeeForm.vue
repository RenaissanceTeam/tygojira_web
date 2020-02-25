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
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  label="Фамилия"
                  v-model="lastName"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  label="Имя"
                  v-model="firstName"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  label="Отчество"
                  v-model="middleName"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Должность"
                  v-model="position"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Подразделение"
                  v-model="subdivision"
                  required
              />
            </v-col>
            <v-col cols="12" sm="12">
              <ChipsCombobox label="Навыки" v-model="skills"/>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                  label="Username"
                  v-model="username"
                  required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                  :items="allRoles"
                  label="Roles"
                  v-model="roles"
                  multiple
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" text @click="close">Close</v-btn>
        <v-btn color="primary" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {ADD_EMPLOYEE, BUSINESS_ROLE} from "../../data/constants/employee_constants";
  import {EmployeeDto, EmployeeWithRoleDto} from "../../data/dto/employee_dto";
  import ChipsCombobox from "../custom/combobox/ChipsCombobox";

  export default {
    name: "AddEmployeeForm",
    components: {ChipsCombobox},
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
    methods: {
      save: async function () {
        const employee = new EmployeeWithRoleDto(
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
        await this.$store.dispatch(ADD_EMPLOYEE, employee)
          .then(() => {
            this.dialog = false;
          })
      },
      close: function () {
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.username = "";
        this.subdivision = "";
        this.roles = [];
        this.dialog = false;
      }
    }
  }
</script>

<style scoped>

</style>