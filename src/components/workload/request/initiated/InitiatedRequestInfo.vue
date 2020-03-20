<template>
  <v-card>
    <v-card-title>Просмотр инициированного запроса</v-card-title>
    <v-card-text class="body-1 text--primary">
      <v-row>
        <v-col cols="2" sm="2">
          Активность
        </v-col>
        <v-divider vertical class="mx-2"/>
        <v-col class="mt-n2 mb-n1 ml-n4">
          <v-dialog v-model="activityDialog" max-width="1200px">
            <template v-slot:activator="{ on }">
              <v-list-item dense link v-on="on">
                {{activity.name}}
              </v-list-item>
            </template>
            <ActivityEditableInfo
              v-if="activityDialog"
              v-model="activity"
            />
          </v-dialog>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2" sm="2">
          Позиция
        </v-col>
        <v-divider vertical class="mx-2"/>
        <v-col>
          {{request.position}}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2" sm="2" class="mt-2">
          Навыки
        </v-col>
        <v-divider vertical class="mx-2"/>
        <v-col class="ml-n4">
          <ChipsAutocomplete
            v-model="request.skills"
            :items="employeeSkills"
            readonly
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2" sm="2" class="mt-n1">
          Сотрудник
        </v-col>
        <v-divider vertical class="mx-2"/>
        <v-col class="mt-n3 ml-n4" v-if="isEmployeeSpecified">
          <v-dialog v-model="employeeDialog" max-width="1200px">
            <template v-slot:activator="{ on }">
              <v-list-item dense link v-on="on">
                {{employee.lastName}} {{employee.firstName}} {{employee.middleName}}
              </v-list-item>
            </template>
            <EmployeeInfo
              v-if="employeeDialog"
              v-model="employee"
            />
          </v-dialog>
        </v-col>
        <v-col class="mt-n1" v-else>
          Сотрудник не указан
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import ActivityEditableInfo from "../../../activity/ActivityEditableInfo";
  import ChipsAutocomplete from "../../../custom/autocomplete/ChipsAutocomplete";
  import EmployeeInfo from "../../../employee/EmployeeInfo";

  export default {
    name: "InitiatedRequestInfo",
    components: {EmployeeInfo, ChipsAutocomplete, ActivityEditableInfo},
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        activityDialog: false,
        employeeDialog: false,
        activity: this.request.activity
      }
    },
    computed: {
      employee() {
        return this.isEmployeeSpecified ? this.request.employee : null;
      },
      employeeSkills() {
        return this.$store.getters.employeeSkills;
      },
      isEmployeeSpecified() {
        return !!this.request.employee;
      }
    }
  }
</script>

<style scoped>

</style>