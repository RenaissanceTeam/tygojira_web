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
      />
    </v-toolbar>
    <v-row dense>
      <v-col
        v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11]"
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
  import {ADD_HOLIDAY} from "../../data/constants/production_calendar_constants";

  export default {
    name: "ProductionCalendar",
    components: {AddHolidayButton, MonthHolidaysCalendar},
    data: function () {
      return {
        year: this.currentYear(),
        supportedYears: this.doubleRange(this.currentYear(), 3),
        events: [
          {
            name: "kekwwww",
            start: "2020-03-04",
            end: "2020-03-04",
            color: "blue"
          },
          {
            name: "asdasdasdasd",
            start: "2020-03-04",
            end: "2020-03-07",
            color: "red"
          },
          {
            name: "some event",
            start: "2020-03-12",
            end: "2020-03-17",
            color: "orange"
          },
          {
            name: "some event",
            start: "2020-04-19",
            end: "2020-04-25",
            color: "yellow"
          },
          {
            name: "some event",
            start: "2020-04-28",
            end: "2020-05-06",
            color: "purple"
          },
          {
            name: "some event 2021",
            start: "2021-04-28",
            end: "2021-05-06",
            color: "purple"
          },
          {
            name: "some event 2019",
            start: "2019-08-28",
            end: "2019-09-06",
            color: "purple"
          }
        ]
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
      }
    }
  }
</script>

<style scoped>
  .selector {
    max-width: 100px;
    margin-top: 5px;
  }
</style>