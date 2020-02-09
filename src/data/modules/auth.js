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
import {tokenExpiration} from "../constants/env_constants"
import {deleteWithExpiry, getOrEmptyIfExpired, getOrThrowIfExpired, setWithExpiry} from "../../utils/local_storage";
import {debug, debugError} from "../../utils/logging";

const state = {
  token: getOrEmptyIfExpired(USER_TOKEN_NAME),
  systemUserRole: ""
};

const getters = {
  isAuthenticated: state => !!state.token
};

const actions = {
  async [AUTH_REQUEST]({commit, dispatch}, credentials) {
    await authApi.login(credentials)
        .then(response => {
          const tokenResponse = response.data;
          debug(AUTH_REQUEST, "tokenResponse:", tokenResponse);
          setWithExpiry(USER_TOKEN_NAME, tokenResponse.token, tokenExpiration);
        })
        .catch(err => {
          debugError(AUTH_REQUEST, err.message, err.response.data.message);
          deleteWithExpiry(USER_TOKEN_NAME);
          commit(AUTH_ERROR, err);
          throw err
        })
        .then(() => dispatch(AUTH_REFRESH))
  },
  async [AUTH_LOGOUT]({commit}) {
    deleteWithExpiry(USER_TOKEN_NAME);
    cleanAuthorizationHeader();
    commit(AUTH_LOGOUT);
  },
  async [AUTH_REFRESH]({commit}) {
    try {
      const token = getOrThrowIfExpired(USER_TOKEN_NAME);
      setAuthorizationHeader("Bearer " + token);

      await authApi.systemUserRole()
          .then(response => {
            const systemUserRoleResponse = response.data;
            debug(AUTH_REFRESH, "systemUserRoleResponse:", systemUserRoleResponse);
            commit(AUTH_REFRESH, systemUserRoleResponse.systemUserRole)
          })
          .catch(err => {
            debugError(AUTH_REFRESH, err.message, err.response.data.message);
            throw err
          });
      commit(AUTH_SUCCESS, token);
    } catch (e) {
      commit(AUTH_ERROR);
      cleanAuthorizationHeader();
      throw e
    }
  }
};

const mutations = {
  [AUTH_SUCCESS](state, token) {
    state.token = token;
  },
  [AUTH_ERROR](state) {
    state.token = "";
    state.systemUserRole = "";
  },
  [AUTH_LOGOUT](state) {
    state.token = "";
    state.systemUserRole = "";
  },
  [AUTH_REFRESH](state, systemUserRole) {
    state.systemUserRole = systemUserRole;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
