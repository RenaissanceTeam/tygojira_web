<!-- TODO: encapsulate it in Auth view with modal overlay-->
<template>
    <div>
        <section>
            <form action="">
                <div class="modal-card" style="width: 30%; margin-top: 8%">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Login</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Username">
                            <b-input
                                    type="login"
                                    v-model="login"
                                    placeholder="Your username"
                                    required>
                            </b-input>
                        </b-field>

                        <b-field label="Password">
                            <b-input
                                    type="password"
                                    v-model="password"
                                    password-reveal
                                    placeholder="Your password"
                                    required>
                            </b-input>
                        </b-field>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-primary" @click="doLogin">Login</button>
                    </footer>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
    import {AUTH_REQUEST} from "../data/constants/auth_constants";

    export default {
        data() {
            return {
                login: '',
                password: ''
            }
        },
        methods: {
            doLogin: function () {
                const {login, password} = this;
                this.$store.dispatch(AUTH_REQUEST, {login, password}).then(() => {
                    this.$router.push("/");
                });
            }
        }
    }
</script>