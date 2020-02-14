<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" v-on="on">Add employee</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Enter employee details</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                        label="First name"
                        v-model="firstName"
                        required
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                        label="Middle name"
                        v-model="middleName"
                        required
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                        label="Last name"
                        v-model="lastName"
                        required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                        label="Position"
                        v-model="position"
                        required
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                        label="Subdivision"
                        v-model="subdivision"
                        required
                />
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
  </v-row>
</template>

<script>
  import {ADD_EMPLOYEE, BUSINESS_ROLE} from "../../data/constants/employee_constants";
  import employeeApi from "../../api/employee_api"
  import {EmployeeDto, EmployeeWithRoleDto} from "../../data/dto/employee_dto";
  import {debugError} from "../../utils/logging";

  export default {
    name: "AddEmployeeForm",
    data: () => ({
      dialog: false,
      allRoles: Object.keys(BUSINESS_ROLE),

      firstName: "",
      middleName: "",
      lastName: "",
      position: "",
      subdivision: "",
      username: "",
      roles: []
    }),
    methods: {
      save: async function () {
        const employee = new EmployeeWithRoleDto(
            new EmployeeDto(
                this.username,
                this.firstName,
                this.lastName,
                this.middleName,
                this.position,
                this.subdivision
            ),
            this.roles
        );
        await employeeApi.addEmployee(employee)
            .then(() => {
              // todo: update employee list?
              this.dialog = false;
            })
            .catch(err => {
              debugError(ADD_EMPLOYEE, err.message, err.response.data.message);
            });
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