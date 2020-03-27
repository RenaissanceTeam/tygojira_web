<template>
  <v-card outlined>
    <v-card-title>
      <v-toolbar dense flat>
        <v-btn outlined class="mr-4" @click="setToday">
          Сегодня
        </v-btn>
        <v-btn fab text small @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer/>
        <v-checkbox
          v-if="isCompareAvailable"
          :disabled="!isEmployeeIdSpecified"
          label="Сопоставить с текущей нагрузкой сотрудника"
          v-model="isCompareActive"
        />
      </v-toolbar>
    </v-card-title>
    <v-card-actions>
      <v-row no-gutters>
        <v-col>
          <v-sheet height="400">
            <v-calendar
              ref="calendar"
              locale="ru"
              v-model="focus"
              :weekdays="weekdays"
              @change="updateRange"
            >
              <template v-slot:day="{ date }">
                <v-row class="fill-height" no-gutters>
                  <template v-if="workloads[date]">
                    <v-sheet
                      v-for="(workload, i) in workloads[date]"
                      :key="i"
                      :title="workload.label"
                      :color="workload.color"
                      :width="`${workload.percent}%`"
                      height="100%"
                      tile
                    />
                  </template>
                </v-row>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import monitoringApi from "../../../api/monitoring_api";
  import {debug, debugError} from "../../../utils/logging";
  import {
    CALENDAR_WEEKDAYS,
    GET_EMPLOYEE_WORKLOAD,
    MAX_WORKING_HOURS
  } from "../../../data/constants/monitoring_constants";

  export default {
    name: "RequestWorkloadHeatmap",
    props: {
      employeeId: {
        type: Number,
        default: null
      },
      workUnits: {
        type: Array,
        required: true
      },
      isCompareAvailable: {
        type: Boolean,
        default: false
      },
      weekdays: {
        type: Array,
        default: function () {
          return CALENDAR_WEEKDAYS;
        }
      },
      maxWorkingHours: {
        type: Number,
        default: MAX_WORKING_HOURS
      }
    },
    data: function () {
      return {
        focus: "",
        start: "",
        isCompareActive: false,

        workloads: {},
        employeeWorkloads: {}
      }
    },
    computed: {
      isEmployeeIdSpecified() {
        return !!this.employeeId;
      },
      employeeIdObserver() {
        return this.employeeId;
      },
      title() {
        const {start} = this;

        if (!start) return "";

        const month = this.monthFormatter(start);
        const year = start.year;

        return `${month} ${year}`;
      },
      monthFormatter() {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      }
    },
    methods: {
      loadEmployeeWorkloads() {
        if (this.isEmployeeIdSpecified) {
          monitoringApi.getEmployeeActivitiesWorkloads(this.employeeId)
            .then(response => {
              const employeeActivitiesWorkloadsDto = response.data;
              debug(GET_EMPLOYEE_WORKLOAD, "employeeActivitiesWorkloadsDto:", employeeActivitiesWorkloadsDto);
              this.mapActivitiesWorkloadsToEmployeeWorkUnits(employeeActivitiesWorkloadsDto.activitiesWorkloads);
            })
            .catch(err => {
              debugError(GET_EMPLOYEE_WORKLOAD, err.message);
              throw err;
            })
        }
      },
      mapActivitiesWorkloadsToEmployeeWorkUnits(activitiesWorkloads) {
        this.employeeWorkloads = activitiesWorkloads
          .flatMap(w => w.workUnits)
          .reduce((workUnit, key) => ({
            ...workUnit,
            [key.date]: key
          }), {});
      },
      loadWorkloads() {
        this.workloads = this.workUnits.reduce((workUnit, key) => ({
          ...workUnit,
          [key.date]: this.mapWorkUnit(key)
        }), {});
      },
      mapWorkUnit(workUnit) {
        const employeeWorkUnit = this.employeeWorkloads[workUnit.date];
        if (employeeWorkUnit) {
          const resultHours = workUnit.hours + employeeWorkUnit.hours;
          const overloadHours = resultHours - this.maxWorkingHours;
          if (overloadHours > 0) {
            return [{
              label: `Перегруз: ${overloadHours} ч.`,
              color: "error",
              percent: 100
            }]
          } else {
            const employeeWorkloadPercent = this.percent(employeeWorkUnit.hours);
            const workloadPercent = this.percent(workUnit.hours);
            return [
              {
                label: `Нагрузка сотрудника: ${employeeWorkUnit.hours} ч.`,
                color: "primary",
                percent: employeeWorkloadPercent
              },
              {
                label: `Запрашиваемая нагрузка: ${workUnit.hours} ч.`,
                color: "success",
                percent: workloadPercent
              }
            ]
          }
        } else {
          return [{
            label: `Запрашиваемая нагрузка: ${workUnit.hours} ч.`,
            color: "success",
            percent: Math.min(Math.trunc(workUnit.hours / this.maxWorkingHours * 100), 100)
          }]
        }
      },
      percent(hours) {
        return Math.min(Math.trunc(hours / this.maxWorkingHours * 100), 100);
      },
      updateRange({start}) {
        this.start = start;
      },
      setToday() {
        this.focus = new Date().toISOString();
      },
      prev() {
        this.$refs.calendar.prev();
      },
      next() {
        this.$refs.calendar.next();
      }
    },
    watch: {
      isCompareActive(value) {
        if (value) {
          this.loadEmployeeWorkloads();
        } else {
          this.employeeWorkloads = {};
        }
      },
      employeeIdObserver(value) {
        if (!value) {
          this.isCompareActive = false;
        } else if (this.isCompareActive && value) {
          this.loadEmployeeWorkloads();
        } else {
          this.employeeWorkloads = {};
        }
      },
      employeeWorkloads() {
        this.loadWorkloads();
      }
    },
    beforeMount() {
      this.loadWorkloads();
    }
  }
</script>

<style scoped>

</style>