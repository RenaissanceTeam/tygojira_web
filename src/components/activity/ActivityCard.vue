<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on }">
      <v-card link v-on="on">
        <v-card-title class="justify-center">
          {{activity.name}}
        </v-card-title>
        <v-card-text class="text-center subtitle-1">
          {{activityDateRangeText}}
        </v-card-text>
      </v-card>
    </template>
    <ActivityEditableInfo
      v-if="dialog"
      :activity="activity"
      v-on:activity-changed="dialog = false"
    />
  </v-dialog>
</template>

<script>
  import ActivityEditableInfo from "./ActivityEditableInfo";

  export default {
    components: {ActivityEditableInfo},
    data: function () {
      return {
        dialog: false
      }
    },
    props: {
      activity: {
        type: Object,
        required: true
      }
    },
    name: "ActivityCard",
    computed: {
      activityDateRangeText: function () {
        return this.activity.startDate + " - " + this.activity.endDate;
      }
    }
  }
</script>

<style scoped>

</style>