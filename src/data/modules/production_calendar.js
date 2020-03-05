import {
  ADD_HOLIDAY,
  DELETE_HOLIDAY,
  GET_HOLIDAYS,
  UPDATE_HOLIDAY
} from "../constants/production_calendar_constants";

const state = {};

const getters = {
  holidayPermissions: (state, rootGetters) => {
    return {
      [GET_HOLIDAYS]:   rootGetters.isAuthenticated,
      [ADD_HOLIDAY]:    rootGetters.isProjectOffice,
      [UPDATE_HOLIDAY]: rootGetters.isProjectOffice,
      [DELETE_HOLIDAY]: rootGetters.isProjectOffice
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