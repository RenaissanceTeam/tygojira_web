<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn
        small
        color="primary"
        v-on="on"
      >
        Добавить праздник
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Введите информацию о празднике</span>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="12">
            <v-text-field
              label="Название*"
              v-model="title"
              :rules="required('Название')"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <RangeDatePicker
              :allowSingleDay="true"
              ref="datePicker"
              label="Даты праздника*"
              v-model="dateRange"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <v-textarea
              :rows="1"
              auto-grow
              label="Описание"
              v-model="description"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary" text @click="close">Close</v-btn>
        <v-btn
          color="primary"
          text
          @click="save"
          :disabled="!areRequiredFieldsSpecified"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import RangeDatePicker from "../custom/datepicker/RangeDatePicker";
  import {areAllRequiredFieldsSpecified, requiredField} from "../../utils/validation";
  import {debug, debugError} from "../../utils/logging";
  import {ADD_HOLIDAY} from "../../data/constants/production_calendar_constants";
  import productionCalendarApi from "../../api/production_calendar_api";
  import {HolidayDto} from "../../data/dto/production_calendar_dto";

  export default {
    name: "AddHolidayButton",
    components: {RangeDatePicker},
    data: function () {
      return {
        dialog: false,

        title: "",
        description: "",
        dateRange: {
          startDate: "",
          endDate: ""
        }
      }
    },
    computed: {
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([
          this.title, this.dateRange.startDate, this.dateRange.endDate
        ]);
      }
    },
    methods: {
      save: async function () {
        const holidayDto = new HolidayDto(
          this.title,
          this.description,
          this.dateRange.startDate,
          this.dateRange.endDate
        );
        debug(ADD_HOLIDAY, "Adding holiday:", holidayDto);
        productionCalendarApi.addHoliday(holidayDto)
          .then(response => {
            const holidayResponse = response.data;
            debug(ADD_HOLIDAY, "Holiday added:", holidayResponse);
            this.refreshForm();
            this.$emit("change", holidayResponse);
          })
          .catch(err => {
            debugError(ADD_HOLIDAY, err.message, err.response.data.message);
            throw err;
          })
      },
      close: function () {
        this.refreshForm();
      },
      required(name) {
        return requiredField(name);
      },
      refreshForm() {
        this.dialog = false;
        this.title = "";
        this.description = "";
        this.dateRange = {
          startDate: "",
          endDate: ""
        };
        this.$refs.datePicker.clear();
      }
    }
  }
</script>

<style scoped>

</style>