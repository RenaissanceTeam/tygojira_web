<template>
  <v-dialog v-model="dialog" persistent max-width="1200px">
    <template v-slot:activator="{ on }">
      <v-btn small color="primary" v-on="on">Создать запрос</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Формирование запроса</span>
        <v-spacer/>
        <v-switch
          color="primary"
          v-model="isEditActive"
          label="Редактировать нагрузку сотрудника"
        />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-autocomplete
              ref="activity"
              clearable
              :items="availableActivities"
              :item-text="activitySelectionText"
              :item-value="activitySelectionValue"
              v-model="selectedActivityId"
              label="Активность*"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              ref="employee"
              clearable
              :items="availableEmployees"
              :item-text="employeeSelectionText"
              :item-value="employeeSelectionValue"
              v-model="selectedEmployeeId"
              :label="employeeLabel"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <ChipsAutocomplete
              :readonly="isEditActive || isEmployeeSelected"
              :items="employeeSkills"
              v-model="selectedEmployeeSkills"
              label="Навыки"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <RangeDatePicker
              ref="datepicker"
              :allowSingleDay="true"
              :min="datePickerMinDate"
              label="Период работы сотрудника*"
              v-model="workRange"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              ref="position"
              :disabled="isEditActive || isEmployeeSelected"
              :items="employeePositions"
              v-model="selectedEmployeePosition"
              clearable
              label="Должность*"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-autocomplete
              :items="availableHours"
              v-model="mondayHours"
              label="Понедельник"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-autocomplete
              :items="availableHours"
              v-model="tuesdayHours"
              label="Вторник"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-autocomplete
              :items="availableHours"
              v-model="wednesdayHours"
              label="Среда"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-autocomplete
              :items="availableHours"
              v-model="thursdayHours"
              label="Четверг"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-autocomplete
              :items="availableHours"
              v-model="fridayHours"
              label="Пятница"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="error"
          text
          @click="refreshAndClose"
        >
          Закрыть
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="sendRequest"
          :disabled="!areRequiredFieldsSpecified"
        >
          Отправить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {ActivityFields} from "../../../../data/dto/activity_dto";
  import RangeDatePicker from "../../../custom/datepicker/RangeDatePicker";
  import ChipsAutocomplete from "../../../custom/autocomplete/ChipsAutocomplete";
  import activityApi from "../../../../api/activity_api";
  import {INT_MAX} from "../../../../data/constants/util_constants";
  import {Order} from "../../../../data/dto/pagination_dto";
  import {debug, debugError} from "../../../../utils/logging";
  import {GET_ACTIVITIES} from "../../../../data/constants/activity_constants";
  import employeeApi from "../../../../api/employee_api";
  import {FullEmployeeInfoDtoFields} from "../../../../data/dto/employee_dto";
  import {GET_EMPLOYEES} from "../../../../data/constants/employee_constants";
  import {areAllRequiredFieldsSpecified} from "../../../../utils/validation";
  import workloadApi from "../../../../api/workload_api";
  import {
    WorkloadRequestInDto,
    WorkloadScheduleDto
  } from "../../../../data/dto/workload_dto";
  import {ADD_WORKLOAD_REQUEST} from "../../../../data/constants/workload_constants";

  export default {
    name: "CreateRequestForm",
    components: {ChipsAutocomplete, RangeDatePicker},
    props: {
      availableHours: {
        type: Array,
        default: function () {
          return [0, 3, 4, 5, 6, 7, 8]
        }
      }
    },
    data: function () {
      return {
        dialog: false,
        isEditActive: false,

        availableActivities: [],
        selectedActivityId: null,

        availableEmployees: [],
        selectedEmployeeId: null,

        selectedEmployeePosition: "",
        selectedEmployeeSkills: [],
        workRange: {
          startDate: "",
          endDate: ""
        },

        mondayHours: 0,
        tuesdayHours: 0,
        wednesdayHours: 0,
        thursdayHours: 0,
        fridayHours: 0
      }
    },
    computed: {
      datePickerMinDate() {
        if (this.isEditActive) {
          return this.getNextWeekDay();
        } else {
          return ""
        }
      },
      isActivitySelected() {
        return !!this.selectedActivityId;
      },
      isEmployeeSelected() {
        return !!this.selectedEmployeeId;
      },
      employeeSkills() {
        return this.$store.getters.employeeSkills;
      },
      employeePositions() {
        return this.$store.getters.employeePositions;
      },
      employeeLabel() {
        return "Сотрудник" + (this.isEditActive ? "*" : "")
      },
      areRequiredFieldsSpecified() {
        const fields = [this.selectedEmployeePosition, this.workRange.startDate, this.workRange.endDate];
        const check = this.isEditActive ? this.isActivitySelected && this.isEmployeeSelected : this.isActivitySelected;
        return check && areAllRequiredFieldsSpecified(fields);
      }
    },
    methods: {
      activitySelectionText: function (activity) {
        return activity.name;
      },
      activitySelectionValue: function (activity) {
        return activity.id;
      },
      employeeSelectionText: function (employee) {
        return employee.lastName + " " + employee.firstName;
      },
      employeeSelectionValue: function (employee) {
        return employee.id;
      },
      getEmployeeById: function (id) {
        return this.availableEmployees.find(e => e.id === id);
      },
      getNextWeekDay: function () {
        const next = new Date();
        next.setDate(next.getDate() - next.getDay() + 7 + 2);
        return next.toISOString().slice(0, 10);
      },
      refreshForm() {
        this.isEditActive = false;
        this.selectedActivityId = null;

        this.selectedEmployeeId = null;
        this.selectedEmployeePosition = "";
        this.selectedEmployeeSkills = [];
        this.workRange = {
          startDate: "",
          endDate: ""
        };

        // clear autocomplete text
        this.$refs.activity.internalSearch = "";
        this.$refs.employee.internalSearch = "";
        this.$refs.position.internalSearch = "";
        this.$refs.datepicker.clear();

        this.mondayHours = 0;
        this.tuesdayHours = 0;
        this.wednesdayHours = 0;
        this.thursdayHours = 0;
        this.fridayHours = 0;
      },
      close() {
        this.dialog = false;
      },
      refreshAndClose() {
        this.close();
        this.refreshForm();
      },
      sendRequest() {
        workloadApi.addRequest(
          new WorkloadRequestInDto(
            this.selectedActivityId,
            this.selectedEmployeePosition,
            this.selectedEmployeeSkills,
            new WorkloadScheduleDto(
              this.workRange.startDate,
              this.workRange.endDate,
              this.mondayHours,
              this.tuesdayHours,
              this.wednesdayHours,
              this.thursdayHours,
              this.fridayHours
            ),
            this.selectedEmployeeId
          )
        ).then(response => {
          const workloadRequestDtoResponse = response.data;
          debug(ADD_WORKLOAD_REQUEST, "workloadRequestDtoResponse:", workloadRequestDtoResponse);
          this.$emit("change", workloadRequestDtoResponse);
          this.refreshAndClose();
        }).catch(err => {
          debugError(ADD_WORKLOAD_REQUEST, err.message, err.response.data.message);
        })
      },
      loadActivities() {
        activityApi.getActivities(
          0,
          INT_MAX,
          Order.ASCENDING,
          [ActivityFields.name]
        ).then(response => {
          const activitiesPageResponse = response.data;
          debug(GET_ACTIVITIES, "CreateRequestForm", "activitiesPageResponse:", activitiesPageResponse);
          this.availableActivities = activitiesPageResponse.items;
        }).catch(err => {
          debugError(GET_ACTIVITIES, "CreateRequestForm", err.message, err.response.data.message);
          throw err;
        })
      },
      loadEmployees() {
        employeeApi.getEmployees(
          0,
          INT_MAX,
          Order.ASCENDING,
          [
            FullEmployeeInfoDtoFields.lastName,
            FullEmployeeInfoDtoFields.firstName,
            FullEmployeeInfoDtoFields.middleName
          ]
        ).then(response => {
          const employeesPageResponse = response.data;
          debug(GET_EMPLOYEES, "CreateRequestForm", "employeesPageResponse:", employeesPageResponse);
          this.availableEmployees = employeesPageResponse.items;
        }).catch(err => {
          debugError(GET_EMPLOYEES, "CreateRequestForm", err.message, err.response.data.message);
          throw err;
        })
      }
    },
    watch: {
      selectedEmployeeId(id) {
        if (this.isEmployeeSelected) {
          const selectedEmployee = this.getEmployeeById(id);
          this.selectedEmployeePosition = selectedEmployee.position;
          this.selectedEmployeeSkills = selectedEmployee.skills;
        }
      },
      isEditActive(value) {
        if (value) {
          this.workRange = {
            startDate: "",
            endDate: ""
          };
          this.$refs.datepicker.clear();
        }
      }
    },
    beforeMount() {
      this.loadActivities();
      this.loadEmployees();
    }
  }
</script>

<style scoped>
</style>