<template>
  <v-dialog
    :persistent="persistent"
    v-model="dialog"
    max-width="1200px"
  >
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
    <AssignedRequestsInfo
      v-if="dialog"
      v-model="editableRequest"
      v-bind:persistent.sync="persistent"
    />
  </v-dialog>
</template>

<script>
  import {WorkloadRequestStatus} from "../../../../data/constants/workload_constants";
  import AssignedRequestsInfo from "./AssignedRequestsInfo";

  export default {
    name: "AssignedRequestsItem",
    components: {AssignedRequestsInfo},
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
        persistent: false,

        editableRequest: this.request
      }
    },
    computed: {
      employeeText() {
        return this.editableRequest.employee ?
          `${this.editableRequest.employee.lastName} ${this.editableRequest.employee.firstName}`
          : "";
      },
      activityText() {
        return this.editableRequest.activity.name;
      },
      positionText() {
        return this.editableRequest.position;
      },
      statusText() {
        return this.statusTexts[this.editableRequest.status];
      },
      statusColor() {
        return this.statusColors[this.editableRequest.status] + "--text";
      }
    }
  }
</script>

<style scoped>

</style>