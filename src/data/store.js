import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import employee from "./modules/employee";
import activity from "./modules/activity";
import production_calendar from "./modules/production_calendar";
import workload from "./modules/workload";
import {debugMode} from "./constants/env_constants"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    employee,
    activity,
    production_calendar,
    workload
  },
  strict: debugMode
});
