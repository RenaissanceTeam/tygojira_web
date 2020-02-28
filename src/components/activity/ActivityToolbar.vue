<template>
  <v-toolbar dense>
    <v-toolbar-title>
      Активности компании
    </v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items>
      <AddActivityButton
        class="px-2"
        v-if="isAddActivityAllowed"
      />
    </v-toolbar-items>
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