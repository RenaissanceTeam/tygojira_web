<template>
  <v-card>
    <v-card-title>
      {{monthText}}
    </v-card-title>
    <v-divider/>
    <v-card-actions>
      <v-calendar
        ref="calendar"
        v-model="focus"
        :start="start"
        :end="end"
        :events="events"
        :event-name="eventName"
        :event-start="eventStart"
        :event-end="eventEnd"
        :event-color="eventColor"
        locale="ru"
        :event-height="20"
        :weekdays="weekdays"
        :show-month-on-first="false"
        type="month"
        @click:event="showEvent"
        @change="updateRange"
      />
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <HolidayInfo
          ref="holiday"
          v-on:deleted="onEventDeleted"
          @change="onEventChanged"
          :event="selectedEvent"
          :color="eventColor(selectedEvent)"
        />
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {BASE_COLOURS} from "../../data/constants/util_constants";
  import HolidayInfo from "./HolidayInfo";

  export default {
    name: "MonthHolidaysCalendar",
    components: {HolidayInfo},
    props: {
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
      year: {
        type: Number,
        required: true
      },
      month: {
        type: Number,
        required: true
      },
      events: {
        type: Array,
        required: true
      }
    },
    data: function () {
      return {
        oldYear: this.year,
        focus: "",
        monthText: "",

        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false
      }
    },
    computed: {
      monthFormatter() {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        });
      },
      start() {
        return this.startYear(this.year);
      },
      end() {
        return this.endYear(this.year);
      }
    },
    methods: {
      updateRange({start}) {
        this.monthText = this.monthFormatter(start);
      },
      eventColor(event) {
        return this.colors[(event.id * 31) % this.colors.length];
      },
      startYear(year) {
        return `${year}-01-01`;
      },
      endYear(year) {
        return `${year}-12-31`;
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
      onEventDeleted(event) {
        this.selectedOpen = false;
        this.selectedElement = null;
        this.$emit("deleted", event);
      },
      onEventChanged(event) {
        this.$emit("change", event);
      }
    },
    watch: {
      year: function () {
        const yearsDifference = this.year - this.oldYear;
        this.$refs.calendar.move(yearsDifference * 12);
        this.oldYear = this.year;
      },
      selectedOpen: function (value) {
        if (!value) this.$refs.holiday.refresh();
      }
    },
    mounted() {
      this.$refs.calendar.move(this.month);
    }
  }
</script>

<style scoped>

  /* hide other month days so they cannot be clicked to change month */
  .v-calendar-weekly >>> .v-calendar-weekly__day.v-outside .v-calendar-weekly__day-label {
    visibility: hidden;
  }

</style>