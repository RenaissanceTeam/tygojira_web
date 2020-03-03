<template>
  <v-autocomplete
    v-model="valueInput"
    chips
    :append-icon="icon"
    :hide-details="readonly"
    :solo="readonly"
    :flat="readonly"
    :clearable="!readonly"
    :label="label"
    :readonly="readonly"
    :items="items"
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
  </v-autocomplete>
</template>

<script>
  export default {
    name: "ChipsAutocomplete",
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
      items: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data: function () {
      return {
        icon: this.readonly ? "" : "$dropdown"
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