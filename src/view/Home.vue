<template>
  <v-row style="text-align: center">
    <v-col cols="12" sm="12">
      <h2>Исходный код</h2>
      <a
        v-for="(source, i) in sources"
        :key="i"
        :href="source.link"
      >
        <h3>{{source.label}}</h3>
      </a>
    </v-col>
    <v-col cols="12" sm="12">
      <div>
        <h2>Выполнили студенты и студентка ФКН</h2>
        <h3
          v-for="(student, i) in students"
          :key="i"
        >
          {{student.fio}}
        </h3>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'Home',
    data: function () {
      return {
        students: [
          {
            fio: "Бузулуков Алексей Максимович"
          },
          {
            fio: "Буняева Виктория Андреевна"
          },
          {
            fio: "Лысенко Макар Константинович"
          },
          {
            fio: "Мамонтов Александр Юрьевич"
          },
          {
            fio: "Скудняков Николай Олегович"
          }
        ],
        sources: [
          {
            label: "devops",
            link: "https://github.com/RenaissanceTeam/tygojira_devops"
          },
          {
            label: "backend",
            link: "https://github.com/RenaissanceTeam/tygojira_backend"
          },
          {
            label: "web",
            link: "https://github.com/RenaissanceTeam/tygojira_web"
          },
          {
            label: "android",
            link: "https://github.com/RenaissanceTeam/tygojira_android"
          }
        ]
      }
    }
  }
</script>

<style scoped>
</style>
