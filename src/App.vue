<template>
  <v-app id="app">
    <AppSideNavigation v-if="isAuthenticated"/>

    <AppBar v-if="isAuthenticated"/>

    <AppContent/>

  </v-app>
</template>

<script>
  import AppBar from "./layout/AppBar";
  import {AUTH_REFRESH} from "./data/constants/auth_constants";
  import {debug, debugError} from "./utils/logging";
  import AppSideNavigation from "./layout/AppSideNavigation";
  import AppContent from "./layout/AppContent";
  import {
    GET_EMPLOYEE_POSITIONS,
    GET_EMPLOYEE_SKILLS,
    GET_EMPLOYEE_SUBDIVISIONS
  } from "./data/constants/employee_constants";

  export default {
    name: 'app',
    components: {
      AppSideNavigation,
      AppBar,
      AppContent
    },
    computed: {
      isAuthenticated: function () {
        return this.$store.getters.isAuthenticated
      }
    },
    beforeCreate() {
      this.$store.dispatch(AUTH_REFRESH).then(() => {
        debug("App beforeCreate:", "Past token used");
      }).catch(e => {
        debugError("App beforeCreate:", e.message);
        this.$router.push("/login");
      });
    },
    mounted() {
      // todo: move these loadings to components which require them
      this.$store.dispatch(GET_EMPLOYEE_SKILLS);
      this.$store.dispatch(GET_EMPLOYEE_SUBDIVISIONS);
      this.$store.dispatch(GET_EMPLOYEE_POSITIONS);
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>