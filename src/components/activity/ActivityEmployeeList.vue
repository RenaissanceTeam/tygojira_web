<template>
  <v-list>
    <v-row no-gutters v-if="workloads.length">
      <v-col cols="12" sm="11">
        <v-divider/>
      </v-col>
      <v-col cols="12" sm="12">
        <v-row
          align="center"
          justify="center"
          v-for="workload in workloads"
          v-bind:key="workload.id"
          no-gutters
        >
          <v-col cols="12" sm="11">
            <EmployeeItem :employee="workload.employee"/>
          </v-col>
          <v-col cols="12" sm="1" class="text-center text--accent-4">
            <span class="primary--text">{{Math.round(workload.percentage)}}%</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters v-else>
      <span class="error--text">Сотрудники еще не назначены на активность</span>
    </v-row>
  </v-list>
</template>

<script>
  import EmployeeItem from "../employee/EmployeeItem";
  import monitoringApi from "../../api/monitoring_api";
  import {debug, debugError} from "../../utils/logging";
  import {GET_ACTIVITY_WORKLOAD} from "../../data/constants/monitoring_constants";

  export default {
    name: "ActivityEmployeeList",
    components: {EmployeeItem},
    props: {
      activityId: {
        type: Number,
        required: true
      }
    },
    data: function () {
      return {
        workloads: []
      }
    },
    methods: {
      loadEvents() {
        monitoringApi.getActivityWorkload(this.activityId)
          .then(response => {
            const activityWorkloadDto = response.data;
            debug(GET_ACTIVITY_WORKLOAD, "activityWorkloadDto:", activityWorkloadDto);
            this.mapWorkloads(activityWorkloadDto.employeeWorkload);
          })
          .catch(err => {
            debugError(GET_ACTIVITY_WORKLOAD, err.message);
            throw err;
          })
      },
      mapWorkloads(workloads) {
        this.workloads = workloads.map(w => {
          return {
            id: w.workloadId,
            employee: w.employee,
            percentage: w.workloadPercentage
          }
        }).sort((a, b) => (a.percentage < b.percentage) - (a.percentage > b.percentage));
      }
    },
    beforeMount() {
      this.loadEvents();
    }
  }
</script>

<style scoped>

</style>