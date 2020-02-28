<template>
  <v-row>
    <v-col cols="0" sm="0">
      <v-icon>{{ item.icon }}</v-icon>
    </v-col>

    <v-col cols="3" sm="3">
      {{ item.key }}
    </v-col>
    <v-divider vertical class="mx-2"/>

    <v-col>
      {{item.value}}
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    name: "InfoItem"
  }
</script>

<style scoped>

</style>