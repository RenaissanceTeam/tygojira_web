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

  export default {
    name: 'app',
    components: {
      Header
    },
    computed: {
      isAuthenticated: function() {
        return store.getters.isAuthenticated
      }
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