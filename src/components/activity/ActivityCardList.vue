<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="12"
      >
        <ActivityToolbar v-on:activity-added="refreshCurrentPage"/>
      </v-col>

      <v-col
        cols="12"
        sm="3"
        v-for="activity in loadedActivities"
        v-bind:key="activity.id"
      >
        <ActivityCard
          :activity="activity"
          v-on:activity-deleted="refreshCurrentPage"
        />
      </v-col>
    </v-row>
    <v-spacer/>
    <v-pagination
      v-model="currentActivityPage"
      :length="totalActivityPages"
      @input="getNextActivities"
    />
  </div>
</template>

<script>
  import {GET_ACTIVITIES} from "../../data/constants/activity_constants";
  import ActivityCard from "./ActivityCard";
  import ActivityToolbar from "./ActivityToolbar";
  import activityApi from "../../api/activity_api";
  import {Order} from "../../data/dto/pagination_dto";
  import {ActivityFields} from "../../data/dto/activity_dto";
  import {debug, debugError} from "../../utils/logging";

  export default {
    name: "ActivityCardList",
    components: {ActivityToolbar, ActivityCard},
    props: {
      activitiesPerPage: {
        type: Number,
        default: 16
      },
      activitiesOrder: {
        type: String,
        default: Order.ASCENDING
      },
      activitiesFieldsOrderBy: {
        type: Array,
        default: function () {
          return [
            ActivityFields.endDate,
            ActivityFields.startDate
          ]
        }
      }
    },
    data: function() {
      return {
        currentActivityPage: 0,
        totalActivities: 0,
        totalActivityPages: 0,
        loadedActivities: []
      }
    },
    computed: {
    },
    methods: {
      getNextActivities: function (page) {
        activityApi.getActivities(
          page - 1,
          this.activitiesPerPage,
          this.activitiesOrder,
          this.activitiesFieldsOrderBy
        ).then(response => {
          const activitiesPageResponse = response.data;
          debug(GET_ACTIVITIES, "activitiesPageResponse:", activitiesPageResponse);

          this.loadedActivities = activitiesPageResponse.items;
          this.totalActivities = activitiesPageResponse.totalItems;
          this.currentActivityPage = activitiesPageResponse.currentPage + 1;
          this.totalActivityPages = activitiesPageResponse.totalPages;
        }).catch(err => {
          debugError(GET_ACTIVITIES, err.message, err.response.data.message);
          throw err;
        })
      },
      refreshFirstPage() {
        this.getNextActivities(1);
      },
      refreshCurrentPage() {
        this.getNextActivities(this.currentActivityPage);
      }
    },
    mounted() {
      this.refreshFirstPage();
    }
  }
</script>

<style scoped>

</style>