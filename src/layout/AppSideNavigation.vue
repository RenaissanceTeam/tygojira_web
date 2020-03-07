<template>
  <v-navigation-drawer
          id="sideNav"
          app
          clipped
          expand-on-hover
  >
    <v-list>
      <v-list-item class="px-2" link>

        <v-list-item-avatar>
          <v-avatar
                  left
                  color="primary"
          >
            <span class="white--text headline">{{avatarText}}</span>
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="title">{{employee.firstName}}</v-list-item-title>
        </v-list-item-content>

      </v-list-item>
    </v-list>

    <v-divider/>

    <v-list
            nav
            dense
    >
      <v-list-item
              v-for="(item, i) in navigationItems"
              :key="i"
              :to="item.link"
              link
        >
        <v-list-item-icon>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{item.title}}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-list dense>
        <v-list-item v-on:click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Выйти</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import {AUTH_LOGOUT} from "../data/constants/auth_constants";

  export default {
    name: "AppSideNavigation",
    computed: {
      navigationItems() {
        return [
          {title: "Календарь", icon: "mdi-calendar-account-outline", link: "", available: this.isPersonalCalendarAvailable},
          {title: "Мои запросы", icon: "mdi-account-arrow-right", link: "/requests/initiated", available: this.areInitiatedRequestsAvailable},
          {title: "Назначенные запросы", icon: "mdi-account-arrow-left", link: "/requests/assigned", available: this.areAssignedRequestsAvailable},
        ].filter(it => it.available)
      },
      employee: function () {
        return this.$store.getters.sessionEmployee;
      },
      avatarText: function () {
        const employee = this.$store.getters.sessionEmployee;
        return employee.firstName.charAt(0).toUpperCase() + employee.lastName.charAt(0).toUpperCase()
      },
      isPersonalCalendarAvailable() {
        return this.isEmployee;
      },
      areInitiatedRequestsAvailable() {
        return this.isProjectLead || this.isLinearLead;
      },
      areAssignedRequestsAvailable() {
        return this.isLinearLead || this.isProjectOffice;
      },
      isEmployee() {
        return this.$store.getters.isEmployee;
      },
      isProjectLead() {
        return this.$store.getters.isProjectLead;
      },
      isLinearLead() {
        return this.$store.getters.isLinearLead;
      },
      isProjectOffice() {
        return this.$store.getters.isProjectOffice;
      },
    },
    methods: {
      logout: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => {
          this.$router.push("/login");
        });
      }
    }
  }
</script>

<style scoped>
</style>