<template>
  <v-toolbar dense elevation="2">
    <v-toolbar-title>
      Активности компании
    </v-toolbar-title>
    <v-spacer/>
    <AddActivityButton
      class="px-2"
      v-if="isAddActivityAllowed"
      v-on:activity-added="$emit('activity-added')"
    />
  </v-toolbar>
</template>

<script>
  import AddActivityButton from "./AddActivityButton";
  import {ADD_ACTIVITY} from "../../data/constants/activity_constants";

  export default {
    name: "ActivityToolbar",
    components: {AddActivityButton},
    computed: {
      isAddActivityAllowed: function () {
        return this.$store.getters.activityPermissions[ADD_ACTIVITY];
      }
    }
  }
</script>

<style scoped>

</style>