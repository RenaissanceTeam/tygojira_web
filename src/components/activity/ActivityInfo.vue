<template>
  <v-row no-gutters>
    <v-col cols="12" sm="12">
      <ListInfoItems :items="activityInfoItems"/>
    </v-col>
    <v-col cols="12" sm="12" class="ml-4">
      <v-row no-gutters class="mt-n2 ml-n4">
        <v-col cols="2" sm="2" class="mt-3 ml-4">
          Руководитель
        </v-col>
        <v-divider vertical class="ml-n2"/>
        <v-col>
          <v-dialog v-model="leadDialog" max-width="1000px">
            <template v-slot:activator="{ on }">
              <v-list-item link v-on="on">
                {{activity.lead.lastName}} {{activity.lead.firstName}} {{activity.lead.middleName}}
              </v-list-item>
            </template>
            <EmployeeInfo v-model="activity.lead"/>
          </v-dialog>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import ListInfoItems from "../common/ListInfoItems";
  import EmployeeInfo from "../employee/EmployeeInfo";

  export default {
    components: {EmployeeInfo, ListInfoItems},
    props: {
      activity: {
        type: Object,
        required: true
      }
    },
    name: "ActivityInfo",
    data: function () {
      return {
        leadDialog: false,
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