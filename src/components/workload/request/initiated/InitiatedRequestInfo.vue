<template>
  <v-card>
    <v-card-title>Просмотр инициированного запроса</v-card-title>
    <v-card-actions>
      <v-row dense>
        <v-col cols="12" sm="12">
          <ListInfoItems :items="requestInfoItems"/>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
  import ListInfoItems from "../../../common/ListInfoItems";

  export default {
    name: "InitiatedRequestInfo",
    components: {ListInfoItems},
    props: {
      request: {
        type: Object,
        required: true
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
      requestInfoItems() {
        return [
          this.activityItem,
          this.positionItem,
          this.skillsItem,
          this.employeeItem
        ]
      },
      activityItem() {
        return {
          key: "Активность",
          value: this.request.activityId
        }
      },
      positionItem() {
        return {
          key: "Позиция",
          value: this.requestPosition.position
        }
      },
      skillsItem() {
        return {
          key: "Навыки",
          value: this.requestPosition.skills.join(", ")
        }
      },
      employeeItem() {
        return {
          key: "Сотрудник",
          value: this.requestPosition.employeeId ?
            this.requestPosition.employeeId :
            "Не указан"
        }
      }
    }
  }
</script>

<style scoped>

</style>