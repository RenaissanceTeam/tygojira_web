import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import employee from "./modules/employee";
import activity from "./modules/activity";
import {debugMode} from "./constants/env_constants"
import production_calendar from "./modules/production_calendar";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    employee,
    activity,
    production_calendar
  },
  strict: debugMode
});
