<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        sm="3"
        v-for="activity in activities"
        v-bind:key="hash(activity)"
      >
        <ActivityCard :activity="activity"/>
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
  import {GET_ACTIVITIES, SELECT_ACTIVITY_PAGE} from "../../data/constants/activity_constants";
  import ActivityCard from "./ActivityCard";

  export default {
    name: "ActivityCardList",
    components: {ActivityCard},
    computed: {
      currentActivityPage: {
        get: function () {
          return this.$store.getters.currentActivityPage;
        },
        set: function (page) {
          this.$store.dispatch(SELECT_ACTIVITY_PAGE, page);
        }
      },
      totalActivityPages: function () {
        return this.$store.getters.totalActivityPages;
      },
      activities: function () {
        return this.$store.getters.loadedActivities;
      },
      totalActivities: function () {
        return this.$store.getters.totalActivities;
      }
    },
    methods: {
      getNextActivities: function (page) {
        this.$store.dispatch(GET_ACTIVITIES, page);
      },
      hash: function (obj) {
        return JSON.stringify(obj);
      }
    },
    mounted() {
      this.getNextActivities(1);
    }
  }
</script>

<style scoped>

</style>