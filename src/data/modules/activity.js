import {
  ACTIVITIES_PER_PAGE,
  ADD_ACTIVITY,
  CLOSE_ACTIVITY,
  DELETE_ACTIVITY,
  GET_ACTIVITIES,
  UPDATE_ACTIVITY,
  SELECT_ACTIVITY_PAGE
} from "../constants/activity_constants";
import activityApi from "../../api/activity_api";
import {Order} from "../dto/pagination_dto";
import {debug, debugError} from "../../utils/logging";
import {Activity, ActivityFields} from "../dto/activity_dto";

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
  async [ADD_ACTIVITY]({commit}, activityDto) {
    debug(ADD_ACTIVITY, "Adding activity:", activityDto);
    activityApi.addActivity(activityDto)
      .then(() => {
        debug(ADD_ACTIVITY, "Activity added:", activityDto);
        commit(ADD_ACTIVITY, activityDto);
      }).catch(err => {
      debugError(ADD_ACTIVITY, err.message, err.response.data.message);
      throw err;
    })
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
  async [UPDATE_ACTIVITY]({commit}, activityWithActivityDto) {
    debug(UPDATE_ACTIVITY, "Updating activity:", activityWithActivityDto);

    const activity = activityWithActivityDto.activity;
    const activityDto = activityWithActivityDto.activityDto;

    activityApi.updateActivity(activity.id, activityDto)
      .then(response => {
        const activityResponse = response.data;
        debug(UPDATE_ACTIVITY, "activityResponse:", activityResponse);

        const newActivity = new Activity(
          activityResponse.id,
          activityResponse.name,
          activityResponse.startDate,
          activityResponse.endDate
        );
        debug(UPDATE_ACTIVITY, "Activity updated:", newActivity);
        commit(UPDATE_ACTIVITY, {activity: activity, newActivity: newActivity});
      })
      .catch(err => {
        debugError(UPDATE_ACTIVITY, err.message, err.response.data.message);
        throw err;
      })
  },
  async [DELETE_ACTIVITY]({commit}, activity) {
    activityApi.deleteActivity(activity.id)
      .then(() => {
        debug(DELETE_ACTIVITY, "Activity deleted", activity);
        commit(DELETE_ACTIVITY, activity);
      })
      .catch(err => {
      debugError(DELETE_ACTIVITY, err.message, err.response.data.message);
      throw err;
    })
  },
  async [SELECT_ACTIVITY_PAGE]({commit}, page) {
    debug(SELECT_ACTIVITY_PAGE, page);
    commit(SELECT_ACTIVITY_PAGE, page);
  }
};

const mutations = {
  [GET_ACTIVITIES](state, activitiesPageResponse) {
    state.loadedActivities = activitiesPageResponse.items;
    state.totalActivities = activitiesPageResponse.totalItems;
    state.currentActivityPage = activitiesPageResponse.currentPage + 1;
    state.totalActivityPages = activitiesPageResponse.totalPages;
  },
  [ADD_ACTIVITY](state, activity) {
    state.loadedActivities = [activity, ...state.loadedActivities];
    state.totalActivities++;
  },
  [UPDATE_ACTIVITY](state, {activity, newActivity}) {
    state.loadedActivities.splice(state.loadedActivities.indexOf(activity), 1, newActivity);
  },
  [DELETE_ACTIVITY](state, deletedActivity) {
    state.loadedActivities.splice(state.loadedActivities.indexOf(deletedActivity), 1);
    state.totalActivities--;
  },
  [SELECT_ACTIVITY_PAGE](state, page) {
    state.currentActivityPage = page;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};