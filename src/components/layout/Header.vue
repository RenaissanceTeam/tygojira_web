<template>
  <header class="header">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li v-on:click="logout"><a>Log out</a></li>
    </ul>
  </header>
</template>

<script>
  import { AUTH_LOGOUT } from "../../data/constants/auth_constants";

  export default {
    name: "Header",
    methods: {
      logout: function() {
        this.$store.dispatch(AUTH_LOGOUT).then(() => {
          this.$router.push("/login");
        });
      }
    }
  };
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #00695c;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}

li a:hover {
  background-color: #439889;
}
</style>
