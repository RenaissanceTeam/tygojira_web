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
      v-model="dateRange"
      range
      no-title
      scrollable
    >
      <v-spacer/>
      <v-btn text color="primary" @click="clear">Cancel</v-btn>
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
      label: {
        type: String,
        default: ""
      }
    },
    data: function () {
      return {
        menu: false,
        dateRange: []
      }
    },
    computed: {
      dateRangeText: function () {
        return this.dateRange.join(" ~ ");
      }
    },
    methods: {
      save() {
        if (this.dateRange.length < 2) {
          this.refreshMenu();
        } else {
          this.dateRange.sort();
          this.$refs.menu.save(this.dateRangeText);
          this.$emit('input', {
            startDate: this.dateRange[0],
            endDate: this.dateRange[1]
          });
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
    }
  }
</script>

<style scoped>

</style>