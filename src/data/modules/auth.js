import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_REFRESH,
  USER_TOKEN_NAME
} from "../constants/auth_constants";
import authApi from "../../api/auth_api";
import {setAuthorizationHeader, cleanAuthorizationHeader} from "../../api/api";
import {debug, tokenExpiration} from "../constants/env_constants"
import {deleteWithExpiry, getWithExpiry, setWithExpiry} from "../../utils/local_storage";

const state = {
  token: localStorage.getItem(USER_TOKEN_NAME) || "",
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
          const token = resp.data.token;

          if (debug) console.log("AUTH_REQUEST token=" + token);
          setWithExpiry(USER_TOKEN_NAME, token, tokenExpiration);
          setAuthorizationHeader("Bearer " + token);
          commit(AUTH_SUCCESS, token);
        }).catch(err => {
          deleteWithExpiry(USER_TOKEN_NAME);
          commit(AUTH_ERROR, err);
          throw err
        });
  },
  async [AUTH_LOGOUT]({commit}) {
    deleteWithExpiry(USER_TOKEN_NAME);
    cleanAuthorizationHeader();
    commit(AUTH_LOGOUT);
  },
  async [AUTH_REFRESH]({commit}) {
    try {
      const token = getWithExpiry(USER_TOKEN_NAME);
      commit(AUTH_SUCCESS, token);
      setAuthorizationHeader("Bearer " + token);
    } catch (e) {
      commit(AUTH_ERROR);
      cleanAuthorizationHeader();
      throw e
    }
  }
};

const mutations = {
  [AUTH_REQUEST](state) {
    state.status = "loading";
  },
  [AUTH_SUCCESS](state, token) {
    state.status = "success";
    state.token = token;
  },
  [AUTH_ERROR](state) {
    state.status = "error";
    state.token = "";
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
