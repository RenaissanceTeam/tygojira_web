<template>
  <v-app id="inspire">
    <v-content>
      <v-container
              class="fill-height"
              fluid
      >
        <v-row
                align="center"
                justify="center"
        >
          <v-col
                  cols="12"
                  sm="8"
                  md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                      color="primary"
                      dark
                      flat
              >
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer/>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                          label="Login"
                          name="login"
                          prepend-icon="mdi-lock"
                          type="text"
                          required
                          :rules="[v => !!v || 'Login is required']"
                          v-model="login"
                  />

                  <v-text-field
                          id="password"
                          label="Password"
                          name="password"
                          prepend-icon="mdi-account"
                          type="password"
                          required
                          :rules="[v => !!v || 'Password is required']"
                          v-model="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn
                        color="primary"
                        v-on:click="doLogin"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-alert v-if="badCredentials" type="error">
              Bad credentials
            </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import {AUTH_REQUEST} from "../data/constants/auth_constants";
  import {Credentials} from "../data/dto/auth_dto";

  export default {
    data: () => ({
      login: '',
      password: '',
      badCredentials: false
    }),
    methods: {
      doLogin: function () {
        const {login, password} = this;
        this.$store.dispatch(AUTH_REQUEST, new Credentials(login, password)).then(() => {
          this.$router.push("/");
        }).catch(e => {
          console.error(e.message);
          this.password = '';
          this.badCredentials = true;
        });
      }
    }
  }
</script>