<template>
  <v-dialog v-model="dialog" max-width="1200px">
    <template v-slot:activator="{ on }">
      <div>
        <v-list-item link v-on="on">
          <v-list-item-content>
            <v-list-item-title>
              <v-row no-gutters>
                <v-col cols="12" sm="10">
                  <span>Сотрудник </span>
                  <span class="primary--text">{{employeeText}}</span>
                  <span> к активности </span>
                  <span class="primary--text">{{activityText}}</span>
                  <span> на должность </span>
                  <span class="primary--text">{{positionText}}</span>
                </v-col>
                <v-col cols="12" sm="2" class="text-right">
                  <span :class="statusColor">{{statusText}}</span>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
      </div>
    </template>
    <InitiatedRequestInfo
      v-if="dialog"
      :request="request"
    />
  </v-dialog>
</template>

<script>
  import {WorkloadRequestStatus} from "../../../../data/constants/workload_constants";
  import InitiatedRequestInfo from "./InitiatedRequestInfo";

  export default {
    name: "InitiatedRequestItem",
    components: {InitiatedRequestInfo},
    props: {
      statusTexts: {
        type: Object,
        default: function () {
          return {
            [WorkloadRequestStatus.NEW]: "новый",
            [WorkloadRequestStatus.PENDING]: "в ожидании",
            [WorkloadRequestStatus.REDIRECTED]: "перенаправлен",
            [WorkloadRequestStatus.REJECTED]: "отклонен",
            [WorkloadRequestStatus.SATISFIED]: "выполнен",
            [WorkloadRequestStatus.SENT]: "отправлен"
          }
        }
      },
      statusColors: {
        type: Object,
        default: function () {
          return {
            [WorkloadRequestStatus.NEW]: "primary",
            [WorkloadRequestStatus.PENDING]: "warning",
            [WorkloadRequestStatus.REDIRECTED]: "primary",
            [WorkloadRequestStatus.REJECTED]: "error",
            [WorkloadRequestStatus.SATISFIED]: "success",
            [WorkloadRequestStatus.SENT]: "primary"
          }
        }
      },
      request: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        dialog: false,
        statusColor: this.statusColors[this.request.status] + "--text",
        statusText: this.statusTexts[this.request.status]
      }
    },
    computed: {
      employeeText() {
        return this.request.employee ? `${this.request.employee.lastName} ${this.request.employee.firstName}` : "";
      },
      activityText() {
        return this.request.activity.name;
      },
      positionText() {
        return this.request.position
      }
    }
  }
</script>

<style scoped>

</style>