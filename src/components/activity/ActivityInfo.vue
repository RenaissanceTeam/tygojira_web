<template>
  <ListInfoItems :items="activityInfoItems"/>
</template>

<script>
  import ListInfoItems from "../common/ListInfoItems";

  export default {
    components: {ListInfoItems},
    props: {
      activity: {
        type: Object,
        required: true
      }
    },
    name: "ActivityInfo",
    data: function () {
      return {
        activityInfoItems: [
          {
            key: "Наименование",
            value: this.activity.name,
            icon: ""
          },
          {
            key: "Дата начала",
            value: this.activity.startDate,
            icon: ""
          },
          {
            key: "Дата окончания",
            value: this.activity.endDate,
            icon: ""
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>