<template>
  <v-card>
    <v-card-title>Назначенные запросы</v-card-title>
    <v-card-actions>
      <v-col cols="12" sm="12">
        <span v-if="noRequests">
          Назначенные запросы отсутствуют
        </span>
        <v-list v-else>
          <v-divider/>
          <AssignedRequestsItem
            v-for="request in assignedRequests"
            v-bind:key="request.id"
            :request="request"
          />
        </v-list>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
  import AssignedRequestsItem from "./AssignedRequestsItem";
  import workloadApi from "../../../../api/workload_api";
  import {debug, debugError} from "../../../../utils/logging";
  import {GET_ASSIGNED_REQUESTS} from "../../../../data/constants/workload_constants";

  export default {
    name: "AssignedRequestsList",
    components: {AssignedRequestsItem},
    data() {
      return {
        assignedRequests: []
      }
    },
    computed: {
      noRequests() {
        return this.assignedRequests.length === 0;
      }
    },
    methods: {
      loadAssignedRequests() {
        workloadApi.getAssignedRequests()
          .then(response => {
            const workloadRequestsDtoResponse = response.data;
            debug(GET_ASSIGNED_REQUESTS, "workloadRequestsDtoResponse:", workloadRequestsDtoResponse);
            this.assignedRequests = workloadRequestsDtoResponse.requests;
          })
          .catch(err => {
            debugError(GET_ASSIGNED_REQUESTS, err.message, err.response.data.message);
          })
      }
    },
    beforeMount() {
      this.loadAssignedRequests();
    }
  }
</script>

<style scoped>

</style>