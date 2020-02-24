<template>
  <v-combobox
          v-model="items"
          chips
          clearable
          :label="label"
          :hint="hint"
          v-on:change="apply"
          :search-input.sync="search"
          multiple
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="remove(item)"
      >
        <strong>{{ item }}</strong>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
  export default {
    name: "ChipsCombobox",
    props: {
      label: {
        type: String,
        default: ""
      },
      hint: {
        type: String,
        default: "Вводите значения через enter"
      }
    },
    data() {
      return {
        items: [],
        search: null
      }
    },
    methods: {
      apply() {
        this.$emit("input", this.items);
      },
      remove(item) {
        this.items.splice(this.items.indexOf(item), 1);
        this.items = [...this.items];
        this.$emit("input", this.items);
      },
    }
  }
</script>

<style scoped>

</style>