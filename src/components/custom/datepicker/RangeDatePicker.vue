<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateRangeText"
        :label="label"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker
      locale="ru"
      :first-day-of-week="1"
      v-model="dateRange"
      :min="min"
      range
      no-title
      scrollable
    >
      <v-spacer/>
      <v-btn text color="primary" @click="clear">Отменить</v-btn>
      <v-btn text color="primary" @click="save">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    name: "RangeDatePicker",
    props: {
      value: {
        type: Object,
        default: function () {
          return {
            startDate: "",
            endDate: ""
          }
        }
      },
      min: {
        type: String,
        default: function () {
          return undefined;
        }
      },
      allowSingleDay: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ""
      }
    },
    data: function () {
      return {
        menu: false,
        dateRange: [this.value.startDate, this.value.endDate]
      }
    },
    computed: {
      dateRangeText: function () {
        if (!this.dateRange[0] && !this.dateRange[1]) {
          return "";
        } else {
          return this.dateRange.join(" ~ ");
        }
      }
    },
    methods: {
      save() {
        if (this.dateRange.length === 0 || (!this.allowSingleDay && this.dateRange.length === 1)) {
          this.refreshMenu();
          this.$emit('input', {
            startDate: "",
            endDate: ""
          });
        } else {
          if (this.dateRange.length === 1) {
            this.$emit('input', {
              startDate: this.dateRange[0],
              endDate: this.dateRange[0]
            });
          } else {
            this.dateRange.sort();
            this.$emit('input', {
              startDate: this.dateRange[0],
              endDate: this.dateRange[1]
            });
          }
          this.$refs.menu.save(this.dateRangeText);
          this.menu = false;
        }
      },
      clear() {
        this.refreshMenu();
      },
      refreshMenu() {
        this.dateRange = [];
        this.menu = false;
      }
    },
    watch: {
      menu: function (value) {
        if (!value) this.save();
      }
    }
  }
</script>

<style scoped>

</style>