<template>
  <v-card>
    <v-card-title>
      {{title}}
      <v-spacer/>
      <v-btn
        class="mx-2"
        small
        color="warning"
        v-on:click="edit"
        v-if="isEditActivityAllowed && !isEditActive && editable"
      >
        Редактировать
      </v-btn>
      <v-btn
        small
        color="error"
        v-on:click="deleteActivity"
        v-if="isDeleteActivityAllowed && editable"
      >
        Удалить
      </v-btn>
    </v-card-title>
    <v-card-text class="body-1 text--primary">
      <v-row dense v-if="!isEditActive">
        <v-col cols="12" sm="12">
          <ActivityInfo
            :activity="value"
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-expansion-panels
            v-if="!isEditActive"
            accordion
            tile
          >
            <v-expansion-panel>
              <v-expansion-panel-header>
                Календарь работы сотрудников на активности
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ActivityCalendar
                  :activity-id="value.id"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" sm="12">
          <v-text-field
            dense
            v-model="name"
            label="Наименование*"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="closeDate"
                clearable
                label="Дата закрытия активности"
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker
              no-title
              scrollable
              :allowed-dates="allowedDates"
              v-model="closeDate"
              @input="dateMenu = false"/>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        small
        color="primary"
        v-on:click="closeActivity"
        :disabled="!isCloseActivityAvailable"
        v-if="isEditActive && isCloseActivityAllowed"
      >
        Закрыть активность
      </v-btn>
      <v-spacer/>
      <v-btn
        small
        color="warning"
        v-on:click="cancelEdit"
        v-if="isEditActive"
      >
        Отменить
      </v-btn>
      <v-btn
        class="mx-2"
        small
        color="success"
        v-on:click="save"
        :disabled="!areRequiredFieldsSpecified"
        v-if="isEditActive"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import ActivityInfo from "./ActivityInfo";
  import {CLOSE_ACTIVITY, DELETE_ACTIVITY, UPDATE_ACTIVITY} from "../../data/constants/activity_constants";
  import {debug, debugError} from "../../utils/logging";
  import {Activity, ActivityDto, CloseActivityDto} from "../../data/dto/activity_dto";
  import activityApi from "../../api/activity_api";
  import {areAllRequiredFieldsSpecified} from "../../utils/validation";
  import ActivityCalendar from "./ActivityCalendar";

  export default {
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: "Карточка активности"
      },
      value: {
        type: Object,
        required: true
      }
    },
    name: "ActivityEditableInfo",
    components: {ActivityCalendar, ActivityInfo},
    data: function () {
      return {
        oldActivity: this.value,
        name: this.value.name,
        closeDate: null,
        dateMenu: false,
        isEditActive: false
      }
    },
    computed: {
      isEditActivityAllowed: function () {
        return this.$store.getters.activityPermissions[UPDATE_ACTIVITY];
      },
      isDeleteActivityAllowed: function () {
        return this.$store.getters.activityPermissions[DELETE_ACTIVITY];
      },
      isCloseActivityAllowed: function () {
        return this.$store.getters.activityPermissions[CLOSE_ACTIVITY];
      },
      areRequiredFieldsSpecified() {
        return areAllRequiredFieldsSpecified([this.name]);
      },
      isCloseActivityAvailable() {
        return areAllRequiredFieldsSpecified([this.closeDate]);
      }
    },
    methods: {
      edit: function () {
        this.isEditActive = true;
      },
      deleteActivity: function () {
        activityApi.deleteActivity(this.value.id)
          .then(() => {
            debug(DELETE_ACTIVITY, "Activity deleted", this.value);
            this.$emit('activity-deleted');
          })
          .catch(err => {
            debugError(DELETE_ACTIVITY, err.message, err.response.data.message);
            throw err;
          });
      },
      cancelEdit: function () {
        this.isEditActive = false;
        this.name = this.oldActivity.name;
      },
      closeActivity: function () {
        activityApi.closeActivity(this.value.id, new CloseActivityDto(this.closeDate))
          .then(() => {
            debug(CLOSE_ACTIVITY, "activity closed successfully");
            this.isEditActive = false;
          })
          .catch(err => {
            debugError(CLOSE_ACTIVITY, err.message, err.response.data.message);
            throw err;
          })
      },
      save: function () {
        const activityDto = new ActivityDto(
          this.name,
          this.value.startDate,
          this.value.endDate
        );
        activityApi.updateActivity(this.value.id, activityDto)
          .then(response => {
            const activityResponse = response.data;
            debug(UPDATE_ACTIVITY, "activityResponse:", activityResponse);

            const newActivity = new Activity(
              activityResponse.id,
              activityResponse.name,
              activityResponse.startDate,
              activityResponse.endDate
            );
            debug(UPDATE_ACTIVITY, "Activity updated:", newActivity);
            this.oldActivity = newActivity;
            this.isEditActive = false;
            this.$emit("input", newActivity);
          })
          .catch(err => {
            debugError(UPDATE_ACTIVITY, err.message, err.response.data.message);
            throw err;
          });
      },
      allowedDates: function (date) {
        return date >= this.value.startDate &&
          date <= this.value.endDate &&
          date <= new Date().toISOString().substr(0, 10);
      }
    }
  }
</script>

<style scoped>

</style>