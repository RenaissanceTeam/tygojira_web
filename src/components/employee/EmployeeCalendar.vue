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
              :show-month-on-first="false"
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
              <ActivityEditableInfo
                v-if="selectedOpen"
                :value="activity"
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
  import ActivityEditableInfo from "../activity/ActivityEditableInfo";
  import {debug, debugError} from "../../utils/logging";
  import monitoringApi from "../../api/monitoring_api";
  import {GET_EMPLOYEE_WORKLOAD} from "../../data/constants/monitoring_constants";
  import("../../utils/array");

  export default {
    name: "EmployeeCalendar",
    components: {ActivityEditableInfo},
    props: {
      employeeId: {
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
          return [1, 2, 3, 4, 5, 6, 0];
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
      }
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
      activity() {
        return this.selectedEvent.activity;
      }
    },
    methods: {
      loadEvents() {
        monitoringApi.getEmployeeActivitiesWorkloads(this.employeeId)
          .then(response => {
            const employeeActivitiesWorkloadsDto = response.data;
            debug(GET_EMPLOYEE_WORKLOAD, "employeeActivitiesWorkloadsDto:", employeeActivitiesWorkloadsDto);
            this.mapWorkloadsToEvents(employeeActivitiesWorkloadsDto.activitiesWorkloads);
          })
          .catch(err => {
            debugError(GET_EMPLOYEE_WORKLOAD, err.message);
            throw err;
          })
      },
      mapWorkloadsToEvents(workloads) {
        const events = workloads
          .flatMap(w => w.workUnits.map(wu => {
              return {
                activity: w.activity,
                date: wu.date,
                hours: wu.hours
              }
            })
          ).groupBy("date");
        this.events = Object.keys(events)
          .flatMap(date => events[date].zipWithIndex())
          .flatMap(el => {
            const {value, i} = el;
            const eventDate = new Date(`${value.date}T${this.startTime}`);
            const hoursDelay = events[value.date].slice(0, i).map(e => e.hours).reduce((a, b) => a + b, 0);
            const startDate = new Date(eventDate);
            startDate.setHours(startDate.getHours() + hoursDelay);
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + value.hours);
            return {
              title: value.activity.name,
              startDate: this.formatDate(startDate),
              endDate: this.formatDate(endDate),
              activity: value.activity
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
        return this.colors[(event.activity.id * 31) % this.colors.length];
      }
    },
    beforeMount() {
      this.loadEvents();
    }
  }
</script>

<style scoped>

</style>