<template>
  <v-app id="app">
    <div>
      <Header v-if="isAuthenticated"/>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
  import Header from './components/layout/Header.vue'
  import store from "./data/store";
  import {AUTH_REFRESH} from "./data/constants/auth_constants";
  import {debug, debugError} from "./utils/logging";

  export default {
    name: 'app',
    components: {
      Header
    },
    computed: {
      isAuthenticated: function () {
        return store.getters.isAuthenticated
      }
    },
    beforeCreate() {
      this.$store.dispatch(AUTH_REFRESH).then(() => {
        debug("App beforeCreate:", "Past token used");
      }).catch(e => {
        debugError("App beforeCreate:", e.message);
        this.$router.push("/login");
      });
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>