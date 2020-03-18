<template>
  <v-dialog v-model="dialog" max-width="1200px">
    <template v-slot:activator="{ on }">
      <div>
        <v-list-item link v-on="on">
          <v-list-item-content>
            <v-list-item-title>
              <v-row no-gutters>
                <v-col cols="12" sm="10">
                  <span>{{requestText}}</span>
                </v-col>
                <v-spacer/>
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
      requestPosition() {
        if (this.request.positions) {
          return this.request.positions[0];
        } else {
          return {}
        }
      },
      requestText() {
        return `${this.employeeText} к ${this.activityText} на ${this.positionText}`
      },
      employeeText() {
        return `Сотрудник ${this.requestPosition.employeeId ?
          `'${this.requestPosition.employeeId}'`
          : ""
        }`
      },
      activityText() {
        return `активности '${this.request.activityId}'`
      },
      positionText() {
        return `должность '${this.requestPosition.position}'`
      }
    }
  }
</script>

<style scoped>

</style>