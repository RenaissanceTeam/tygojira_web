<template>
  <div>
    <form class="login" @submit.prevent="doLogin">
      <h1>Sign in</h1>
      <label>User name</label>
      <input required v-model="login" type="text" placeholder="Login" />
      <label>Password</label>
      <input
        required
        v-model="password"
        type="password"
        placeholder="Password"
      />
      <hr />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style>
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
</style>

<script>
import { AUTH_REQUEST } from "../data/constants/auth_constants";

export default {
  name: "login",
  data() {
    return {
      login: "",
      password: ""
    };
  },
  methods: {
    doLogin: function() {
      const { login, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { login, password }).then(() => {
        this.$router.push("/");
      });
    }
  }
};
</script>
