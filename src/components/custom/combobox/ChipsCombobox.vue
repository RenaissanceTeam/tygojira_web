<template>
  <v-combobox
          v-model="valueInput"
          chips
          append-icon=""
          :hide-details="readonly"
          :solo="readonly"
          :flat="readonly"
          :clearable="!readonly"
          :label="label"
          :hint="hint"
          :readonly="readonly"
          multiple
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
              v-bind="attrs"
              :input-value="selected"
              :close="!readonly"
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
      readonly: {
        type: Boolean,
        default: false
      },
      value: {
        type: Array,
        default: function () {
          return [];
        }
      },
      label: {
        type: String,
        default: ""
      },
      hint: {
        type: String,
        default: "Вводите значения через enter"
      }
    },
    computed: {
      valueInput: {
        get: function () {
          return this.value;
        },
        set: function (value) {
          this.$emit('input', value);
        }
      }
    },
    methods: {
      remove(item) {
        this.value.splice(this.value.indexOf(item), 1);
      }
    }
  }
</script>

<style scoped>

</style>