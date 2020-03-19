import {
  ADD_WORKLOAD_REQUEST,
  GET_ASSIGNED_REQUESTS,
  GET_INITIATED_REQUESTS,
  PENDING_REQUEST,
  REDIRECT_REQUEST,
  REJECT_REQUEST,
  SATISFY_REQUEST
} from "../constants/workload_constants";

const state = {};

const getters = {
  workloadPermissions: (state, rootGetters) => {
    return {
      [ADD_WORKLOAD_REQUEST]: rootGetters.isProjectLead || rootGetters.isLinearLead,
      [GET_INITIATED_REQUESTS]: rootGetters.isProjectLead || rootGetters.isLinearLead,
      [GET_ASSIGNED_REQUESTS]: rootGetters.isLinearLead || rootGetters.isProjectOffice,
      [REDIRECT_REQUEST]: rootGetters.isLinearLead,
      [SATISFY_REQUEST]: rootGetters.isLinearLead || rootGetters.isProjectOffice,
      [REJECT_REQUEST]: rootGetters.isLinearLead || rootGetters.isProjectOffice,
      [PENDING_REQUEST]: rootGetters.isProjectOffice
    }
  }
};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
};