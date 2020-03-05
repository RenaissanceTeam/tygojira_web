<template>
  <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="value"
          transition="scale-transition"
          offset-y
          min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-combobox
              v-model="valueInput"
              clearable
              multiple
              chips
              :label="label"
              :hint="hint"
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
      <v-btn text color="primary" @click="cancel">Отменить</v-btn>
      <v-btn text color="primary" @click="apply">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    name: "RangeAndSingleDatePicker",
    props: {
      value: {
        type: Array,
        default: function () {
          return [];
        }
      },
      label: {
        type: String,
        default: ""
      },
      hint: {
        type: String,
        default: "Выберите несколько дат или интервалов"
      }
    },
    data: function () {
      return {
        menu: false,
        datesRange: []
      }
    },
    computed: {
      valueInput: {
        get: function () {
          return this.value;
        },
        set: function (value) {
          this.$emit('input', value);
        }
      }
    },
    methods: {
      apply() {
        this.datesRange = this.datesRange.sort();
        this.value.push(this.datesRange);
        this.datesRange = [];
        this.$refs.menu.save(this.value);
      },
      cancel() {
        this.menu = false;
        this.datesRange = [];
      },
      remove(item) {
        this.value.splice(this.value.indexOf(item), 1);
      },
      dateRangeText(dateRange) {
        return dateRange.join(" ~ ");
      },
      allowedDates(date) {
        const crossingDate = this.value.find(dateRange => {
          return date === dateRange[0] || (date >= dateRange[0] && date <= dateRange[1]);
        });
        return !crossingDate;
      }
    }
  }
</script>

<style scoped>

</style>