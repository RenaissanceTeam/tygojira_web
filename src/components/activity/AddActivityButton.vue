<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small color="primary" v-on="on">Добавить</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Введите информацию об активности</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field
                label="Наименование*"
                v-model="name"
                :rules="required('Наименование')"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <RangeDatePicker
                ref="datePicker"
                label="Даты активности*"
                v-model="dateRange"
              />
            </v-col>
          </v-row>
        </v-container>
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
  import {ActivityDto} from "../../data/dto/activity_dto";
  import {ADD_ACTIVITY} from "../../data/constants/activity_constants";
  import RangeDatePicker from "../custom/datepicker/RangeDatePicker";
  import {debug, debugError} from "../../utils/logging";
  import activityApi from "../../api/activity_api";

  export default {
    name: "AddActivityButton",
    components: {RangeDatePicker},
    data: function () {
      return {
        dialog: false,
        name: "",
        dateRange: {
          startDate: "",
          endDate: ""
        }
      }
    },
    computed: {
      areRequiredFieldsSpecified() {
        const requiredFields = [this.name, this.dateRange.startDate, this.dateRange.endDate];
        const notSpecified = requiredFields.some(field => !field);
        return !notSpecified;
      },
      dateRangeText() {
        return this.dateRange.startDate + " ~ " + this.dateRange.endDate;
      }
    },
    methods: {
      save: async function () {
        const activityDto = new ActivityDto(
          this.name,
          this.dateRange.startDate,
          this.dateRange.endDate
        );
        debug(ADD_ACTIVITY, "Adding activity:", activityDto);
        activityApi.addActivity(activityDto)
          .then(response => {
            const activityResponse = response.data;
            debug(ADD_ACTIVITY, "Activity added:", activityResponse);
            this.refreshForm();
            this.$emit("activity-added");
          })
          .catch(err => {
            debugError(ADD_ACTIVITY, err.message, err.response.data.message);
            throw err;
          })
      },
      close: function () {
        this.refreshForm();
      },
      required: function (name) {
        return [value => !!value || `${name} required`];
      },
      refreshForm() {
        this.dialog = false;
        this.name = "";
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
