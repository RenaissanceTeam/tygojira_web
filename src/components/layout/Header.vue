<template>
  <v-toolbar color="primary" >
    <v-toolbar-title id="title">
      <router-link to="/" tag="span" style="cursor: pointer">
        <img src="../../assets/logo.png" alt="FORCE"/>
      </router-link>
    </v-toolbar-title>
    <v-toolbar-items>
      <v-btn
              text
              color="secondary"
              v-for="item in toolbarItems"
              :key="item.title"
              :to="item.link">
        {{ item.title }}
      </v-btn>
    </v-toolbar-items>
    <v-spacer/>
    <div v-if="isAuthenticated">
      <v-btn
              color="secondary"
              text
              v-on:click="logout"
      >
        logout
      </v-btn>
    </div>
  </v-toolbar>
</template>

<script>
  import {AUTH_LOGOUT} from "../../data/constants/auth_constants";

  export default {
    data: () => ({
      toolbarItems: [
        {title: 'About', link: '/about'},
        {title: 'Employee', link: '/employee'},
      ]
    }),
    computed: {
      isAuthenticated: function() {
        return this.$store.getters.isAuthenticated
      }
    },
    methods: {
      logout: function() {
        this.$store.dispatch(AUTH_LOGOUT).then(() => {
          this.$router.push("/login");
        });
      }
    }
  }
</script>

<style scoped>
  #title {
    margin-top: 10px;
    margin-right: 15px;
  }
</style>
