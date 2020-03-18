<template>
  <v-card>
    <v-card-title>
      Инициированные запросы
      <v-spacer/>
      <CreateRequestForm class="px-2"/>
    </v-card-title>
    <v-card-actions>
      <v-col cols="12" sm="12">
        <span v-if="noRequests">
          Инициированные запросы отсутствуют
        </span>
        <v-list v-else>
          <v-divider/>
          <InitiatedRequestItem
            v-for="request in initiatedRequests"
            v-bind:key="request.id"
            :request="request"
          />
        </v-list>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script>
  import CreateRequestForm from "./CreateRequestForm";
  import InitiatedRequestItem from "./InitiatedRequestItem";
  import workloadApi from "../../../../api/workload_api";
  import {debug, debugError} from "../../../../utils/logging";
  import {GET_INITIATED_REQUESTS} from "../../../../data/constants/workload_constants";

  export default {
    name: "InitiatedRequestsList",
    components: {InitiatedRequestItem, CreateRequestForm},
    data() {
      return {
        initiatedRequests: []
      }
    },
    computed: {
      noRequests() {
        return this.initiatedRequests.length === 0;
      }
    },
    methods: {
      loadInitiatedRequests() {
        workloadApi.getInitiatedRequests()
          .then(response => {
            const workloadRequestsDtoResponse = response.data;
            debug(GET_INITIATED_REQUESTS, "workloadRequestsDtoResponse:", workloadRequestsDtoResponse);
            this.initiatedRequests = workloadRequestsDtoResponse.requests;
          })
          .catch(err => {
            debugError(GET_INITIATED_REQUESTS, err.message, err.response.data.message);
          })
      }
    },
    beforeMount() {
      this.loadInitiatedRequests();
    }
  }
</script>

<style scoped>

</style>