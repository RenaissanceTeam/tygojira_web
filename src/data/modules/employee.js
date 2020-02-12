import {
  CALLING_EMPLOYEE,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_EMPLOYEES,
  BUSINESS_ROLE
} from "../constants/employee_constants";
import employeeApi from "../../api/employee_api";
import {debug, debugError} from "../../utils/logging";

const state = {
  roles: []
};

const getters = {
  isEmployee: state => state.roles.includes(BUSINESS_ROLE.EMPLOYEE),
  isProjectLead: state => state.roles.includes(BUSINESS_ROLE.PROJECT_LEAD),
  isLinearLead: state => state.roles.includes(BUSINESS_ROLE.LINEAR_LEAD),
  isProjectOffice: state => state.roles.includes(BUSINESS_ROLE.PROJECT_OFFICE),

  employeePermissions: (state, rootGetters) => {
    return {
      [CALLING_EMPLOYEE]: rootGetters.isAuthenticated,
      [GET_EMPLOYEES]: rootGetters.isAuthenticated,
      [ADD_EMPLOYEE]: rootGetters.isLinearLead || rootGetters.isAdmin,
      [UPDATE_EMPLOYEE]: rootGetters.isLinearLead,
      [DELETE_EMPLOYEE]: rootGetters.isLinearLead
    }
  }
};

const actions = {
  async [CALLING_EMPLOYEE]({commit, rootGetters}) {
    await employeeApi.getEmployeeRole(rootGetters.username)
        .then(response => {
          const employeeRoleResponse = response.data;
          debug(CALLING_EMPLOYEE, "employeeRoleResponse:", employeeRoleResponse);
          commit(CALLING_EMPLOYEE, employeeRoleResponse.roles)
        })
        .catch(err => {
          debugError(CALLING_EMPLOYEE, err.message, err.response.data.message);

          if (rootGetters.isUser) {
            throw err;
          } else {
            commit(CALLING_EMPLOYEE, []);
          }
        });
  }
};

const mutations = {
  [CALLING_EMPLOYEE](state, roles) {
    state.roles = roles;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
