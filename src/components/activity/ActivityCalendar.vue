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
        <v-menu bottom right>
          <template v-slot:activator="{ on }">
            <v-btn
              outlined
              v-on="on"
            >
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Месяц</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Неделя</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>День</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-card-title>
    <v-divider/>
    <v-card-actions>
      <v-row no-gutters>
        <v-col cols="12" sm="12">
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              :events="events"
              :event-name="eventName"
              :event-start="eventStart"
              :event-end="eventEnd"
              :event-color="eventColor"
              locale="ru"
              :event-height="20"
              :weekdays="weekdays"
              :type="type"
              @click:event="showEvent"
              @change="updateRange"
              @click:more="viewDay"
              @click:date="viewDay"
            />
            <v-dialog
              max-width="1000px"
              v-model="selectedOpen"
              :activator="selectedElement"
              offset-x
            >
              <EmployeeInfo
                v-if="selectedOpen"
                :value="employee"
                :editable="false"
              />
            </v-dialog>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {BASE_COLOURS} from "../../data/constants/util_constants";
  import {
    CALENDAR_WEEKDAYS,
    GET_ACTIVITY_WORKLOAD, MAX_WORKING_HOURS
  } from "../../data/constants/monitoring_constants";
  import monitoringApi from "../../api/monitoring_api";
  import {debug, debugError} from "../../utils/logging";
  import EmployeeInfo from "../employee/EmployeeInfo";

  export default {
    name: "ActivityCalendar",
    components: {EmployeeInfo},
    props: {
      activityId: {
        type: Number,
        required: true
      },
      eventName: {
        type: String,
        default: "title"
      },
      eventStart: {
        type: String,
        default: "startDate"
      },
      eventEnd: {
        type: String,
        default: "endDate"
      },
      colors: {
        type: Array,
        default: function () {
          return BASE_COLOURS;
        }
      },
      weekdays: {
        type: Array,
        default: function () {
          return CALENDAR_WEEKDAYS;
        }
      },
      typeToLabel: {
        type: Object,
        default: function () {
          return {
            month: "Месяц",
            week: "Неделя",
            day: "День"
          }
        }
      },
      startTime: {
        type: String,
        default: "12:00:00"
      },
      maxWorkingHours: {
        type: Number,
        default: MAX_WORKING_HOURS
      },
    },
    data: function () {
      return {
        type: "month",
        focus: "",
        start: "",
        end: "",

        events: [],
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false
      }
    },
    computed: {
      title() {
        const {start, end} = this;

        if (!start || !end) {
          return "";
        }
        const startMonth = this.monthFormatter(start);
        const endMonth = this.monthFormatter(end);
        const suffixMonth = startMonth === endMonth ? "" : endMonth;
        const startYear = start.year;
        const endYear = end.year;
        const suffixYear = startYear === endYear ? '' : endYear;
        const startDay = start.day;
        const endDay = end.day;

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`;
          case 'week':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`;
        }
        return "";
      },
      monthFormatter() {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
      employee() {
        return this.selectedEvent.employee;
      }
    },
    methods: {
      loadEvents() {
        monitoringApi.getActivityWorkload(this.activityId)
          .then(response => {
            const activityWorkloadDto = response.data;
            debug(GET_ACTIVITY_WORKLOAD, "activityWorkloadDto:", activityWorkloadDto);
            this.mapWorkloadsToEvents(activityWorkloadDto.employeeWorkload);
          })
          .catch(err => {
            debugError(GET_ACTIVITY_WORKLOAD, err.message);
            throw err;
          })
      },
      mapWorkloadsToEvents(workloads) {
        this.events = workloads
          .flatMap(w => w.workUnits.map(wu => {
              return {
                employee: w.employee,
                date: wu.date,
                hours: wu.hours
              }
            })
          ).map(event => {
            const startDate = new Date(`${event.date}T${this.startTime}`);
            const hoursDelay = Math.round(Math.random() *
              Math.max(this.maxWorkingHours - event.hours, 0)
            );
            startDate.setHours(startDate.getHours() + hoursDelay);
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + event.hours);

            return {
              title: event.employee.lastName + " " + event.employee.firstName.charAt(0) + ".",
              startDate: this.formatDate(startDate),
              endDate: this.formatDate(endDate),
              employee: event.employee
            }
          });
      },
      formatDate(date) {
        const dateISO = date.toISOString();
        return `${dateISO.slice(0, 10)} ${dateISO.slice(11, 16)}`;
      },
      viewDay({date}) {
        this.focus = date;
        this.type = "day";
      },
      setToday() {
        this.focus = new Date().toISOString();
      },
      updateRange({start, end}) {
        this.start = start;
        this.end = end;
      },
      prev() {
        this.$refs.calendar.prev();
      },
      next() {
        this.$refs.calendar.next();
      },
      showEvent({nativeEvent, event}) {
        const open = () => {
          this.selectedEvent = event;
          this.selectedElement = nativeEvent.target;
          setTimeout(() => this.selectedOpen = true, 10);
        };
        if (this.selectedOpen) {
          this.selectedOpen = false;
          setTimeout(open, 10);
        } else {
          open();
        }
        nativeEvent.stopPropagation()
      },
      eventColor(event) {
        return this.colors[(event.employee.id * 31) % this.colors.length];
      }
    },
    beforeMount() {
      this.loadEvents();
    }
  }
</script>

<style scoped>

</style>