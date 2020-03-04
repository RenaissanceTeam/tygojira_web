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
        :event-color="getEventColor"
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
  export default {
    name: "MonthHolidaysCalendar",
    props: {
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
      getEventColor(event) {
        return event.color;
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