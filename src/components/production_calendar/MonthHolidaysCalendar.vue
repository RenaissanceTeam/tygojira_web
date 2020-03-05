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
        @change="updateRange"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
  import {BASE_COLOURS} from "../../data/constants/util_constants";

  export default {
    name: "MonthHolidaysCalendar",
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
        monthText: ""
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
      }
    },
    watch: {
      year: function () {
        const yearsDifference = this.year - this.oldYear;
        this.$refs.calendar.move(yearsDifference * 12);
        this.oldYear = this.year;
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