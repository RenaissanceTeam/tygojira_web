import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from "../constants/auth_constants";
import authApi from "../../api/auth_api";
import api from "../../api/api";
import {debug} from "../constants/env_constants"

const state = {
  token: localStorage.getItem("user-token") || "",
  status: ""
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  async [AUTH_REQUEST]({commit}, credentials) {
    commit(AUTH_REQUEST);
    await authApi.login(credentials)
        .then(resp => {
          if (debug) console.log("AUTH_REQUEST response=" + JSON.stringify(resp));
          if (debug) console.log("AUTH_REQUEST token=" + resp.data.token);
          localStorage.setItem("user-token", resp.data.token);
          api.defaults.headers.common['Authorization'] = "Bearer " + resp.data.token;
          commit(AUTH_SUCCESS, resp);
        })
        .catch(err => {
          localStorage.removeItem("user-token");
          commit(AUTH_ERROR, err);
          throw err
        });
  },
  async [AUTH_LOGOUT]({commit}) {
    localStorage.removeItem("user-token");
    commit(AUTH_LOGOUT);
  }
};

const mutations = {
  [AUTH_REQUEST](state) {
    state.status = "loading";
  },
  [AUTH_SUCCESS](state, resp) {
    state.status = "success";
    state.token = resp.data.token;
  },
  [AUTH_ERROR](state) {
    state.status = "error";
  },
  [AUTH_LOGOUT](state) {
    state.token = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
