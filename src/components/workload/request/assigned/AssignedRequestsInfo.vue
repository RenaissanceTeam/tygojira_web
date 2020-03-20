<template>
  <v-card>
    <v-card-title>
      {{title}}
      <v-spacer/>
      <v-switch
        v-if="canBePerformed"
        dense
        color="primary"
        v-model="isPerformingActive"
        label="Выполнение запроса"
      />
    </v-card-title>
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
                {{value.activity.name}}
              </v-list-item>
            </template>
            <ActivityEditableInfo
              v-if="activityDialog"
              v-model="value.activity"
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
          {{value.position}}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2" sm="2">
          Навыки
        </v-col>
        <v-divider vertical class="mx-2"/>
        <v-col class="ml-n4 mt-n3">
          <ChipsAutocomplete
            v-model="value.skills"
            :items="employeeSkills"
            readonly
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2" sm="2" class="mt-n2">
          Сотрудник
        </v-col>
        <v-divider vertical class="mx-2"/>
        <v-col class="mt-n4 ml-n4" v-if="isEmployeeSpecified || isEmployeeSelected">
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

      <v-row justify="center" v-if="isPerformingActive">
        <v-expansion-panels accordion flat>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Выбрать сотрудника
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row no-gutters>
                <v-checkbox
                  label="Подбор сотрудников с подходящими навыками"
                  class="my-0 px-0"
                  v-model="onlySkillsFilter"
                />
                <v-spacer/>
                <v-btn
                  v-if="isEmployeeSelected"
                  small
                  color="error"
                  @click="onCancelEmployeeSelection"
                >
                  Отменить выбор
                </v-btn>
              </v-row>
              <v-list>
                <v-row no-gutters v-if="isEmployeesAvailable">
                  <v-col cols="12" sm="11">
                    <v-divider/>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-row
                      align="center"
                      v-for="employeeItem in availableEmployees"
                      v-bind:key="employeeItem.id"
                      no-gutters
                    >
                      <v-col cols="12" sm="11">
                        <EmployeeItem :employee="employeeItem"/>
                      </v-col>
                      <v-col cols="12" sm="1">
                        <AssignedRequestSelectEmployeeButton
                          v-if="employee ? employee.id !== employeeItem.id : true"
                          class="ml-3"
                          :employee="employeeItem"
                          @change="onEmployeeSelected"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="12" sm="12">
                    <span class="error--text">Сотрудники не найдены</span>
                  </v-col>
                </v-row>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="isPerformingActive">
      <v-spacer/>
      <v-btn
        v-if="isRejectRequestAllowed"
        text
        color="error"
        @click="rejectRequest"
      >
        Отклонить
      </v-btn>
      <v-btn
        v-if="isRedirectRequestAllowed"
        text
        color="primary"
        @click="redirectRequest"
      >
        Направить в проектный офис
      </v-btn>
      <v-btn
        v-if="isPendingRequestAllowed"
        text
        color="warning"
        @click="pendingRequest"
      >
        Поставить в ожидание
      </v-btn>
      <v-btn
        v-if="isSatisfyRequestAllowed"
        text
        color="success"
        @click="satisfyRequest"
      >
        Выполнить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {
    PENDING_REQUEST,
    REDIRECT_REQUEST,
    REJECT_REQUEST,
    SATISFY_REQUEST,
    WorkloadRequestStatus
  } from "../../../../data/constants/workload_constants";
  import {debug, debugError} from "../../../../utils/logging";
  import ActivityEditableInfo from "../../../activity/ActivityEditableInfo";
  import EmployeeInfo from "../../../employee/EmployeeInfo";
  import workloadApi from "../../../../api/workload_api";
  import employeeApi from "../../../../api/employee_api";
  import {INT_MAX} from "../../../../data/constants/util_constants";
  import {Order} from "../../../../data/dto/pagination_dto";
  import {FullEmployeeInfoDtoFields} from "../../../../data/dto/employee_dto";
  import {FILTER_EMPLOYEES} from "../../../../data/constants/employee_constants";
  import EmployeeItem from "../../../employee/EmployeeItem";
  import AssignedRequestSelectEmployeeButton from "./AssignedRequestSelectEmployeeButton";
  import ChipsAutocomplete from "../../../custom/autocomplete/ChipsAutocomplete";
  import {EmployeeIdDto} from "../../../../data/dto/workload_dto";

  export default {
    name: "AssignedRequestsInfo",
    components: {
      ChipsAutocomplete,
      AssignedRequestSelectEmployeeButton, EmployeeItem, EmployeeInfo, ActivityEditableInfo},
    props: {
      value: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        activityDialog: false,
        employeeDialog: false,
        selectEmployeeDialog: false,
        onlySkillsFilter: false,

        isPerformingActive: false,

        availableEmployees: [],
        selectedEmployee: null
      }
    },
    computed: {
      title() {
        return this.isPerformingActive ?
          "Выполнение назначенного запроса" :
          "Просмотр назначенного запроса"
      },
      employee() {
        if (this.isEmployeeSelected) {
          return this.selectedEmployee;
        } else {
          return this.isEmployeeSpecified ? this.value.employee : undefined;
        }
      },
      isEmployeesAvailable() {
        return !!this.availableEmployees.length;
      },
      isEmployeeSelected() {
        return !!this.selectedEmployee;
      },
      isEmployeeSpecified() {
        return !!this.value.employee;
      },
      employeeSkills() {
        return this.$store.getters.employeeSkills;
      },
      canBePerformed() {
        return this.value.status !== WorkloadRequestStatus.REJECTED &&
          this.value.status !== WorkloadRequestStatus.SATISFIED
      },
      isRejectRequestAllowed() {
        return this.$store.getters.workloadPermissions[REJECT_REQUEST];
      },
      isSatisfyRequestAllowed() {
        return this.$store.getters.workloadPermissions[SATISFY_REQUEST];
      },
      isPendingRequestAllowed() {
        return this.$store.getters.workloadPermissions[PENDING_REQUEST];
      },
      isRedirectRequestAllowed() {
        return this.$store.getters.workloadPermissions[REDIRECT_REQUEST];
      }
    },
    methods: {
      loadEmployees() {
        const employeeFilter = this.onlySkillsFilter ? {
          skills: this.value.skills
        } : {
          position: this.value.position,
          skills: this.value.skills
        };
        employeeApi.filterEmployees(
          0,
          INT_MAX,
          Order.ASCENDING,
          [
            FullEmployeeInfoDtoFields.lastName,
            FullEmployeeInfoDtoFields.firstName,
            FullEmployeeInfoDtoFields.middleName
          ],
          employeeFilter
        ).then(response => {
          const employeesPageResponse = response.data;
          debug(FILTER_EMPLOYEES, "AssignedRequestsInfo", "employeesPageResponse:", employeesPageResponse);
          this.availableEmployees = employeesPageResponse.items;
        }).catch(err => {
          debugError(FILTER_EMPLOYEES, "AssignedRequestsInfo", err.message, err.response.data.message);
          throw err;
        })
      },
      onCancelEmployeeSelection() {
        this.selectedEmployee = null;
      },
      onEmployeeSelected(selectedEmployee) {
        this.selectedEmployee = selectedEmployee;
      },
      rejectRequest() {
        workloadApi.rejectRequest(this.value.id)
          .then(response => {
            const workloadRequestDtoResponse = response.data;
            debug(REJECT_REQUEST, "workloadRequestDtoResponse:", workloadRequestDtoResponse);
            this.isPerformingActive = false;
            this.$emit("input", workloadRequestDtoResponse);
          })
          .catch(err => {
            debugError(REJECT_REQUEST, err.message, err.response.data.message)
          })
      },
      satisfyRequest() {
        workloadApi.satisfyRequest(
          this.value.id,
          this.isEmployeeSelected ? new EmployeeIdDto(this.selectedEmployee.id) : undefined
        ).then(response => {
          const workloadRequestDtoResponse = response.data;
          debug(SATISFY_REQUEST, "workloadRequestDtoResponse:", workloadRequestDtoResponse);
          this.isPerformingActive = false;
          this.$emit("input", workloadRequestDtoResponse);
        }).catch(err => {
          debugError(SATISFY_REQUEST, err.message, err.response.data.message)
        })
      },
      redirectRequest() {
        workloadApi.redirectRequest(this.value.id)
          .then(response => {
            const workloadRequestDtoResponse = response.data;
            debug(REDIRECT_REQUEST, "workloadRequestDtoResponse:", workloadRequestDtoResponse);
            this.isPerformingActive = false;
            this.$emit("input", workloadRequestDtoResponse);
          })
          .catch(err => {
            debugError(REDIRECT_REQUEST, err.message, err.response.data.message)
          })
      },
      pendingRequest() {
        workloadApi.pendingRequest(this.value.id)
          .then(response => {
            const workloadRequestDtoResponse = response.data;
            debug(PENDING_REQUEST, "workloadRequestDtoResponse:", workloadRequestDtoResponse);
            this.isPerformingActive = false;
            this.$emit("input", workloadRequestDtoResponse);
          })
          .catch(err => {
            debugError(PENDING_REQUEST, err.message, err.response.data.message)
          })
      }
    },
    watch: {
      isPerformingActive(value) {
        this.selectedEmployee = null;
        this.$emit("update:persistent", value);
      },
      onlySkillsFilter() {
        this.loadEmployees();
      }
    },
    beforeMount() {
      if (this.canBePerformed) {
        this.loadEmployees();
      }
    }
  }
</script>

<style scoped>

</style>