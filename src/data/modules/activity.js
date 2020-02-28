import {
  ACTIVITIES_PER_PAGE,
  ADD_ACTIVITY,
  CLOSE_ACTIVITY,
  DELETE_ACTIVITY,
  GET_ACTIVITIES,
  UPDATE_ACTIVITY
} from "../constants/activity_constants";
import activityApi from "../../api/activity_api";
import {Order} from "../dto/pagination_dto";
import {debug, debugError} from "../../utils/logging";
import {ActivityFields} from "../dto/activity_dto";

const state = {
  currentActivityPage: 0,
  totalActivities: 0,
  totalActivityPages: 0,
  loadedActivities: [],
};

const getters = {
  currentActivityPage: state => state.currentActivityPage,
  totalActivities:     state => state.totalActivities,
  totalActivityPages:  state => state.totalActivityPages,
  loadedActivities:    state => state.loadedActivities,

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
  async [ADD_ACTIVITY]() {

  },
  async [GET_ACTIVITIES]({commit}, page) {
    activityApi.getActivities(
      page - 1,
      ACTIVITIES_PER_PAGE,
      Order.ASCENDING, [
        ActivityFields.endDate
      ]
    ).then(response => {
      const activitiesPageResponse = response.data;
      debug(GET_ACTIVITIES, "activitiesPageResponse:", activitiesPageResponse);
      commit(GET_ACTIVITIES, activitiesPageResponse);
    }).catch(err => {
      debugError(GET_ACTIVITIES, err.message, err.response.data.message);
      throw err;
    })
  },
  async [UPDATE_ACTIVITY]() {

  },
  async [DELETE_ACTIVITY]() {

  }
};

const mutations = {
  [GET_ACTIVITIES](state, activitiesPageResponse) {
    state.loadedActivities = activitiesPageResponse.items;
    state.totalActivities = activitiesPageResponse.totalItems;
    state.currentActivityPage = activitiesPageResponse.currentPage + 1;
    state.totalActivityPages = activitiesPageResponse.totalPages;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};