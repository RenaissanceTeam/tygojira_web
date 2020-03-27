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
  import monitoringApi from "../../api/monitoring_api";
  import {debug, debugError} from "../../utils/logging";
  import {
    CALENDAR_WEEKDAYS,
    GET_EMPLOYEE_WORKLOAD, MAX_WORKING_HOURS,
    WorkloadDifferenceType
  } from "../../data/constants/monitoring_constants";

  export default {
    name: "EmployeeHeatmap",
    props: {
      employeeId: {
        type: Number,
        required: true
      },
      maxWorkingHours: {
        type: Number,
        default: MAX_WORKING_HOURS
      },
      typeToColor: {
        type: Object,
        default: function () {
          return {
            [WorkloadDifferenceType.OVERLOAD]: "error",
            [WorkloadDifferenceType.IDLE]: "success",
            [WorkloadDifferenceType.FIT]: "primary"
          }
        }
      },
      typeToLabel: {
        type: Object,
        default: function () {
          return {
            [WorkloadDifferenceType.OVERLOAD]: "Перегруз",
            [WorkloadDifferenceType.IDLE]: "Простой",
            [WorkloadDifferenceType.FIT]: "Нагружен"
          }
        }
      },
      weekdays: {
        type: Array,
        default: function () {
          return CALENDAR_WEEKDAYS;
        }
      }
    },
    data: function () {
      return {
        focus: "",
        start: "",

        workloads: {}
      }
    },
    computed: {
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
      loadDifferences() {
        monitoringApi.getEmployeeActivitiesWorkloads(this.employeeId)
          .then(response => {
            const employeeActivitiesWorkloadsDto = response.data;
            debug(GET_EMPLOYEE_WORKLOAD, "employeeActivitiesWorkloadsDto:", employeeActivitiesWorkloadsDto);
            this.mapDifferencesToWorkloads(employeeActivitiesWorkloadsDto.workloadDifferences);
          })
          .catch(err => {
            debugError(GET_EMPLOYEE_WORKLOAD, err.message);
            throw err;
          })
      },
      mapDifferencesToWorkloads(workloadDifferences) {
        this.workloads = workloadDifferences.reduce((workload, key) => ({
          ...workload,
          [key.date]: this.mapLoads(key)
        }), {});
      },
      mapLoads(workload) {
        const workloadLabel = `${this.typeToLabel[workload.type]}: ${workload.difference} ч.`;
        const color = this.typeToColor[workload.type];

        switch (workload.type) {
          case WorkloadDifferenceType.OVERLOAD:
            return [{
              label: workloadLabel,
              percent: 100,
              color: color
            }];
          case WorkloadDifferenceType.IDLE:
            return [
              {
                label: this.loadLabel(this.maxWorkingHours - workload.difference),
                percent: 100 - this.idleHoursToPercent(workload.difference),
                color: this.typeToColor[WorkloadDifferenceType.FIT]
              },
              {
                label: workloadLabel,
                percent: this.idleHoursToPercent(workload.difference),
                color: color
              }];
          case WorkloadDifferenceType.FIT:
            return [{
              label: this.loadLabel(this.maxWorkingHours),
              percent: 100,
              color: color
            }];
        }
      },
      loadLabel(hours) {
        return `${this.typeToLabel[WorkloadDifferenceType.FIT]}: ${hours} ч.`;
      },
      idleHoursToPercent(hours) {
        return Math.min(hours * 100.0 / this.maxWorkingHours, 100);
      },
      setToday() {
        this.focus = new Date().toISOString();
      },
      updateRange({start}) {
        this.start = start;
      },
      prev() {
        this.$refs.calendar.prev();
      },
      next() {
        this.$refs.calendar.next();
      },
    },
    beforeMount() {
      this.loadDifferences();
    }
  }
</script>

<style scoped>

</style>