import {
  ADD_ACTIVITY,
  CLOSE_ACTIVITY,
  DELETE_ACTIVITY,
  GET_ACTIVITIES,
  UPDATE_ACTIVITY
} from "../constants/activity_constants";

const state = {
};

const getters = {
  activityPermissions: (state, rootGetters) => {
    return {
      [ADD_ACTIVITY]:    rootGetters.isLinearLead,
      [GET_ACTIVITIES]:  rootGetters.isAuthenticated,
      [UPDATE_ACTIVITY]: rootGetters.isLinearLead,
      [DELETE_ACTIVITY]: rootGetters.isLinearLead,
      [CLOSE_ACTIVITY]:  rootGetters.isLinearLead
    }
  }
};

const actions = {
};

const mutations = {
};

export default {
  state,
  getters,
  actions,
  mutations
};