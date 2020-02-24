<template>
  <v-container>
    <v-card>
      <v-card-title>Фильтрация</v-card-title>
      <v-card-actions>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
                    label="Фамилия"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
                    label="Имя"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
                    label="Отчество"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                    label="Должность"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
                    label="Подразделение"
            />
          </v-col>
          <v-col cols="12" sm="12">
            <ChipsCombobox label="Навыки" v-model="skills"/>
          </v-col>
          <v-col cols="12" sm="12">
            <RangeAndSingleDatePicker label="Доступные даты" v-model="dates"/>
          </v-col>
          <v-col cols="12" sm="6" class="text-left">
            <v-btn>
              Очистить фильтр
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="text-right">
            <v-btn
                    color="primary"
            >
              Применить фильтр
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import RangeAndSingleDatePicker from "../custom/datepicker/RangeAndSingleDatePicker";
  import ChipsCombobox from "../custom/combobox/ChipsCombobox";

  export default {
    name: "EmployeeFilterForm",
    components: {ChipsCombobox, RangeAndSingleDatePicker},
    data: () => ({
      dates: [],
      skills: []
    })
  }
</script>

<style scoped>

</style>