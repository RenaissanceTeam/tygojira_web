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
import {EmployeeDto, EmployeeWithRoleDto} from "../dto/employee_dto";

const state = {
  employee: new EmployeeDto("", "", "", "", "", ""),
  roles: []
};

const getters = {
  sessionEmployee: state => state.employee,

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
    const username = rootGetters.username;
    await employeeApi.getEmployeeRole(username)
        .then(response => {
          const employeeRoleResponse = response.data;
          debug(CALLING_EMPLOYEE, "employeeRoleResponse:", employeeRoleResponse);
          commit(CALLING_EMPLOYEE, employeeRoleResponse)
        })
        .catch(err => {
          debugError(CALLING_EMPLOYEE, err.message, err.response.data.message);

          if (rootGetters.isUser) {
            throw err;
          } else {
            commit(CALLING_EMPLOYEE, new EmployeeWithRoleDto(
                new EmployeeDto(
                    username,
                    username,
                    rootGetters.systemUserRole,
                    username,
                    "",
                    ""
                ),
                []
            ));
          }
        });
  }
};

const mutations = {
  [CALLING_EMPLOYEE](state, employeeRole) {
    state.employee = employeeRole.employee;
    state.roles = employeeRole.roles;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
