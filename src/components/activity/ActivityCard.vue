<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ on }">
      <v-card link v-on="on">
        <v-card-title class="justify-center">
          {{editableActivity.name}}
        </v-card-title>
        <v-card-text class="text-center subtitle-1">
          {{activityDateRangeText}}
        </v-card-text>
      </v-card>
    </template>
    <ActivityEditableInfo
      editable
      v-if="dialog"
      v-model="editableActivity"
      v-on:activity-deleted="onEmployeeDeleted"
    />
  </v-dialog>
</template>

<script>
  import ActivityEditableInfo from "./ActivityEditableInfo";

  export default {
    name: "ActivityCard",
    components: {ActivityEditableInfo},
    props: {
      activity: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        editableActivity: this.activity,
        dialog: false
      }
    },
    computed: {
      activityDateRangeText: function () {
        return this.editableActivity.startDate + " - " + this.editableActivity.endDate;
      }
    },
    methods: {
      onEmployeeDeleted() {
        this.dialog = false;
        this.$emit("activity-deleted");
      }
    }
  }
</script>

<style scoped>

</style>