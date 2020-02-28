<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn small color="primary" v-on="on">Добавить</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Введите информаци об активности</span>
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
              {{dateRangeText}}
              <RangeDatePicker v-model="dateRange"/>
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
        const requiredFields = [this.name, this.startDate, this.endDate];
        const notSpecified = requiredFields.some(field => !field);
        return !notSpecified && !!this.roles.length;
      },
      dateRangeText() {
        return this.dateRange.startDate + " ~ " + this.dateRange.endDate;
      }
    },
    methods: {
      save: async function () {
        const activity = new ActivityDto(
          this.name,
          this.startDate,
          this.endDate
        );
        await this.$store.dispatch(ADD_ACTIVITY, activity)
          .then(() => {
            this.dialog = false;
          })
      },
      close: function () {
        this.name = "";
        this.dialog = false;
      },
      required: function (name) {
        return [value => !!value || `${name} required`];
      }
    }
  }
</script>

<style scoped>

</style>