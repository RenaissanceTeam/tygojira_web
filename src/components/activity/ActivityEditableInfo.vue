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
        :activity="activity"
      />

      <v-row v-else>
        <v-col cols="12" sm="10">
          <v-text-field
            class="centerTextField"
            dense
            v-model="name"
            label="Наименование"
            :readonly="!isEditActive"
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

  export default {
    props: {
      title: {
        type: String,
        default: "Карточка активности"
      },
      activity: {
        type: Object,
        required: true
      }
    },
    name: "ActivityEditableInfo",
    components: {ActivityInfo},
    data: function () {
      return {
        name: this.activity.name,
        isEditActive: false
      }
    },
    computed: {
      isEditActivityAllowed: function () {
        return this.$store.getters.activityPermissions[UPDATE_ACTIVITY] && !!this.activity.id;
      },
      isDeleteActivityAllowed: function () {
        return this.$store.getters.activityPermissions[DELETE_ACTIVITY] && !!this.activity.id;
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

      },
      cancelEdit: function () {
        this.isEditActive = false;
      },
      save: function () {

      }
    }
  }
</script>

<style scoped>

</style>