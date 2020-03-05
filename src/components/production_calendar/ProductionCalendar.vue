<template>
  <div>
    <v-toolbar dense elevation="2">
      <v-toolbar-items>
        <v-select
          class="selector"
          v-model="year"
          label="year"
          solo
          flat
          dense
          :items="supportedYears"
        />
      </v-toolbar-items>
      <v-spacer/>
      <AddHolidayButton
        class="px-2"
        v-if="isAddHolidayAllowed"
        @change="refresh"
      />
    </v-toolbar>
    <v-row dense>
      <v-col
        v-for="i in Array(12).keys()"
        :key="i"
        cols="12"
        xl="2"
        lg="3"
        md="4"
        sm="6"
      >
        <MonthHolidaysCalendar
          :year="year"
          :month="i"
          :events="events"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import MonthHolidaysCalendar from "./MonthHolidaysCalendar";
  import AddHolidayButton from "./AddHolidayButton";
  import {ADD_HOLIDAY, GET_HOLIDAYS} from "../../data/constants/production_calendar_constants";
  import productionCalendarApi from "../../api/production_calendar_api";
  import {debug, debugError} from "../../utils/logging";

  export default {
    name: "ProductionCalendar",
    components: {AddHolidayButton, MonthHolidaysCalendar},
    data: function () {
      return {
        year: this.currentYear(),
        supportedYears: this.doubleRange(this.currentYear(), 3),
        events: []
      }
    },
    computed: {
      isAddHolidayAllowed: function () {
        return this.$store.getters.holidayPermissions[ADD_HOLIDAY];
      }
    },
    methods: {
      currentYear() {
        return new Date().getFullYear();
      },
      doubleRange(value, range) {
        return Array(range * 2 + 1).fill(value).map((v, i) => v + i - range);
      },
      async loadHolidays(year) {
        productionCalendarApi.getHolidays(year)
          .then(response => {
            const holidaysResponse = response.data;
            debug(GET_HOLIDAYS, "holidaysResponse:", holidaysResponse);
            this.events = holidaysResponse.holidays;
          })
          .catch(err => {
            debugError(GET_HOLIDAYS, err.message, err.response.data.message);
            throw err;
          })
      },
      refresh() {
        this.loadHolidays(this.year);
      }
    },
    watch: {
      year: function (year) {
        this.loadHolidays(year)
      }
    },
    mounted() {
      this.refresh();
    }
  }
</script>

<style scoped>
  .selector {
    max-width: 100px;
    margin-top: 5px;
  }
</style>