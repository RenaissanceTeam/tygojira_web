<template>
  <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
          min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-combobox
              v-model="dates"
              clearable
              multiple
              chips
              :label="label"
              readonly
              v-on="on"
      >
        <template v-slot:selection="{ attrs, item, select, selected }">
          <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="remove(item)"
          >
            <strong>{{ dateRangeText(item) }}</strong>
          </v-chip>
        </template>
      </v-combobox>
    </template>
    <v-date-picker
            no-title
            scrollable
            multiple
            :allowed-dates="allowedDates"
            v-model="datesRange"
            range
    >
      <v-spacer/>
      <v-btn text color="primary" @click="cancel">Cancel</v-btn>
      <v-btn text color="primary" @click="apply">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    name: "RangeAndSingleDatePicker",
    props: {
      label: {
        type: String,
        default: "Выберите несколько дат или интервалов"
      },
      selectedDates: {
        type: Object,
        default: function () {
          return {
            selectedDates: []
          }
        }
      },
    },
    data: function () {
      return {
        menu: false,
        datesRange: [],
        dates: []
      }
    },
    methods: {
      apply() {
        this.datesRange = this.datesRange.sort();
        this.dates.push(this.datesRange);
        this.$emit("input", {
          selectedDates: this.dates
        });
        this.datesRange = [];
        this.$refs.menu.save(this.dates);
      },
      cancel() {
        this.menu = false;
        this.datesRange = [];
      },
      remove(item) {
        this.dates.splice(this.dates.indexOf(item), 1);
        this.dates = [...this.dates];
        this.$emit("input", {
          selectedDates: this.dates
        });
      },
      dateRangeText(dateRange) {
        return dateRange.join(" ~ ");
      },
      allowedDates(date) {
        const crossingDate = this.dates.find(dateRange => {
          return date === dateRange[0] || (date >= dateRange[0] && date <= dateRange[1]);
        });
        return !crossingDate;
      }
    }
  }
</script>

<style scoped>

</style>