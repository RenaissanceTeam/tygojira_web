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
  import {debug} from "./data/constants/env_constants";

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
        if (debug) console.log("Using past token");
      }).catch(e => {
        if (debug) console.log(e.message);
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