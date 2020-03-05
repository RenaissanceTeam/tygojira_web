<template>
  <v-card
    color="grey lighten-4"
    flat
  >
    <v-toolbar
      dense
      :color="color"
      dark
    >
      <v-toolbar-title>{{baseHoliday.title}}</v-toolbar-title>
      <v-spacer/>
      <v-btn
        icon
        class="mx-1"
        v-if="!isEditActive"
        @click="onEditClicked"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="onDeleteClicked"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row dense v-if="isEditActive">
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
      <v-col v-else>
        {{description}}
      </v-col>
    </v-card-text>
    <v-card-actions v-if="isEditActive">
      <v-btn
        text
        :color="color"
        @click="refresh"
      >
        Отменить
      </v-btn>
      <v-spacer/>
      <v-btn
        text
        color="success"
        @click="onSaveClicked"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import {areAllRequiredFieldsSpecified, requiredField} from "../../utils/validation";
  import RangeDatePicker from "../custom/datepicker/RangeDatePicker";
  import productionCalendarApi from "../../api/production_calendar_api";
  import {debug, debugError} from "../../utils/logging";
  import {DELETE_HOLIDAY, UPDATE_HOLIDAY} from "../../data/constants/production_calendar_constants";
  import {HolidayDto} from "../../data/dto/production_calendar_dto";

  export default {
    name: "HolidayInfo",
    components: {RangeDatePicker},
    props: {
      event: {
        type: Object,
        required: true
      },
      color: {
        type: String,
        required: true
      }
    },
    data: function () {
      return {
        baseHoliday: this.event,
        isEditActive: false,

        title: this.event.title,
        description: this.event.description,
        dateRange: {
          startDate: this.event.startDate,
          endDate: this.event.endDate
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
      onSaveClicked() {
        const holidayDto = new HolidayDto(
          this.title,
          this.description,
          this.dateRange.startDate,
          this.dateRange.endDate
        );
        debug(UPDATE_HOLIDAY, "Updating holiday:", this.baseHoliday, holidayDto);
        productionCalendarApi.updateHoliday(this.baseHoliday.id, holidayDto)
          .then(response => {
            const holidayResponse = response.data;
            debug(UPDATE_HOLIDAY, "Got updated holiday:", holidayResponse);
            this.$emit("change", {
              oldEvent: this.baseHoliday,
              newEvent: holidayResponse
            });
            this.baseHoliday = holidayResponse;
            this.refresh();
          })
          .catch(err => {
            debugError(UPDATE_HOLIDAY, err.message, err.response.data.message);
            throw err;
          })
      },
      onEditClicked() {
        this.isEditActive = true;
      },
      onDeleteClicked() {
        productionCalendarApi.deleteHoliday(this.baseHoliday.id)
          .then(() => {
            debug(DELETE_HOLIDAY, "Holiday deleted", this.baseHoliday);
            this.$emit("deleted", this.baseHoliday);
          })
          .catch(err => {
            debugError(DELETE_HOLIDAY, err.message, err.response.data.message);
            throw err;
          })
      },
      refreshInfo() {
        this.title = this.baseHoliday.title;
        this.description = this.baseHoliday.description;
        this.dateRange = {
          startDate: this.baseHoliday.startDate,
          endDate: this.baseHoliday.endDate
        }
      },
      refresh() {
        this.isEditActive = false;
        this.refreshInfo();
      },
      required(name) {
        return requiredField(name);
      }
    }
  }
</script>

<style scoped>

</style>