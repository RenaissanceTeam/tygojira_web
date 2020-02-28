<template>
  <div>
    <ActivityToolbar/>
    <ActivityCardList/>
  </div>
</template>

<script>
  import {ActivityDto} from "../../data/dto/activity_dto";
  import ActivityCardList from "./ActivityCardList";
  import ActivityToolbar from "./ActivityToolbar";

  export default {
    name: "Activity",
    components: {ActivityToolbar, ActivityCardList},
    data: function () {
      return {
        activity: new ActivityDto("name", "startDate", "endDate")
      }
    }
  }
</script>

<style scoped>

</style>