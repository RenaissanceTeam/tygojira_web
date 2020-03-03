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
        v-if="isEditActivityAllowed && !isEditActive"
      >
        Редактировать
      </v-btn>
      <v-btn
        small
        color="error"
        v-on:click="deleteActivity"
        v-if="isDeleteActivityAllowed"
      >
        Удалить
      </v-btn>
    </v-card-title>
    <v-card-text>
      <ActivityInfo
        v-if="!isEditActive"
        :activity="value"
      />

      <v-row v-else>
        <v-col cols="12" sm="10">
          <v-text-field
            dense
            v-model="name"
            label="Наименование"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
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
  import {DELETE_ACTIVITY, UPDATE_ACTIVITY} from "../../data/constants/activity_constants";
  import {debug, debugError} from "../../utils/logging";
  import {Activity, ActivityDto} from "../../data/dto/activity_dto";
  import activityApi from "../../api/activity_api";

  export default {
    props: {
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
    components: {ActivityInfo},
    data: function () {
      return {
        oldActivity: this.value,
        name: this.value.name,
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
      areRequiredFieldsSpecified() {
        const requiredFields = [this.name];
        const notSpecified = requiredFields.some(field => !field);
        return !notSpecified;
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
      }
    }
  }
</script>

<style scoped>

</style>