<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small color="primary" v-on="on">Добавить</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Введите информацию об активности</span>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="12">
            <v-text-field
              label="Наименование*"
              v-model="name"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <RangeDatePicker
              ref="datePicker"
              label="Даты активности*"
              v-model="dateRange"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-autocomplete
              ref="lead"
              clearable
              :items="projectLeads"
              :item-text="employeeSelectionText"
              :item-value="employeeSelectionValue"
              v-model="selectedProjectLeadId"
              label="Руководитель*"
            />
          </v-col>
        </v-row>
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
  import {ActivityDto} from "../../data/dto/activity_dto";
  import {ADD_ACTIVITY} from "../../data/constants/activity_constants";
  import RangeDatePicker from "../custom/datepicker/RangeDatePicker";
  import {debug, debugError} from "../../utils/logging";
  import activityApi from "../../api/activity_api";
  import employeeApi from "../../api/employee_api";
  import {areAllRequiredFieldsSpecified, requiredField} from "../../utils/validation";
  import {GET_PROJECT_LEADS} from "../../data/constants/employee_constants";

  export default {
    name: "AddActivityButton",
    components: {RangeDatePicker},
    data: function () {
      return {
        dialog: false,
        projectLeads: [],

        selectedProjectLeadId: null,
        name: "",
        dateRange: {
          startDate: "",
          endDate: ""
        }
      }
    },
    computed: {
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.name, this.dateRange.startDate, this.dateRange.endDate, this.selectedProjectLeadId
        ]);
      }
    },
    methods: {
      save: async function () {
        const activityDto = new ActivityDto(
          this.name,
          this.dateRange.startDate,
          this.dateRange.endDate,
          this.selectedProjectLeadId
        );
        debug(ADD_ACTIVITY, "Adding activity:", activityDto);
        activityApi.addActivity(activityDto)
          .then(response => {
            const activityResponse = response.data;
            debug(ADD_ACTIVITY, "Activity added:", activityResponse);
            this.refreshForm();
            this.$emit("activity-added");
          })
          .catch(err => {
            debugError(ADD_ACTIVITY, err.message, err.response.data.message);
            throw err;
          })
      },
      loadProjectLeads() {
        employeeApi.getLeads()
          .then(response => {
            const projectLeadsDtoResponse = response.data;
            debug(GET_PROJECT_LEADS, "projectLeadsDtoResponse:", projectLeadsDtoResponse);
            this.projectLeads = projectLeadsDtoResponse.leads;
          })
          .catch(err => {
            debugError(GET_PROJECT_LEADS, err.message, err.response.data.message);
            throw err;
          })
      },
      employeeSelectionText: function (employee) {
        return employee.lastName + " " + employee.firstName;
      },
      employeeSelectionValue: function (employee) {
        return employee.id;
      },
      close: function () {
        this.refreshForm();
      },
      required: function (name) {
        return requiredField(name);
      },
      refreshForm() {
        this.dialog = false;
        this.name = "";
        this.dateRange = {
          startDate: "",
          endDate: ""
        };
        this.selectedProjectLeadId = null;
        this.$refs.lead.internalSearch = "";
        this.$refs.datePicker.clear();
      }
    },
    beforeMount() {
      this.loadProjectLeads();
    }
  }
</script>

<style scoped>

</style>
