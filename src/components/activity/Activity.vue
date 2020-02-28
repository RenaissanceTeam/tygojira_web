<template>
  <div>
    <ActivityToolbar/>
    <ActivityCardList/>
  </div>
</template>

<script>
  import ActivityCardList from "./ActivityCardList";
  import ActivityToolbar from "./ActivityToolbar";

  export default {
    name: "Activity",
    components: {ActivityToolbar, ActivityCardList}
  }
</script>

<style scoped>

</style>