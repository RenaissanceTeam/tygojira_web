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
import {EmployeeDto, EmployeeWithRoleDto, FullEmployeeInfoDtoFields} from "../dto/employee_dto";
import {Order, PageRequest, Sort} from "../dto/pagination_dto";

const state = {
  sessionEmployee: new EmployeeDto("", "", "", "", "", ""),
  sessionRoles: [],

  isEmployeeFilterActive: false,
  loadedEmployees: [],
};

const getters = {
  sessionEmployee: state => state.sessionEmployee,

  isEmployeeFilterActive: state => state.isEmployeeFilterActive,
  loadedEmployees: state => state.loadedEmployees,

  isEmployee: state => state.sessionRoles.includes(BUSINESS_ROLE.EMPLOYEE),
  isProjectLead: state => state.sessionRoles.includes(BUSINESS_ROLE.PROJECT_LEAD),
  isLinearLead: state => state.sessionRoles.includes(BUSINESS_ROLE.LINEAR_LEAD),
  isProjectOffice: state => state.sessionRoles.includes(BUSINESS_ROLE.PROJECT_OFFICE),

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
  },
  async [GET_EMPLOYEES]({commit}, {page, employeesPerPage}) {
    return await employeeApi.getEmployees(new PageRequest(
      page,
      employeesPerPage,
      new Sort(Order.ASCENDING, [
          FullEmployeeInfoDtoFields.lastName,
          FullEmployeeInfoDtoFields.firstName,
          FullEmployeeInfoDtoFields.middleName
        ]
      ))
    ).then(response => {
      const employeesPageResponse = response.data;
      debug(GET_EMPLOYEES, "employeesPageResponse:", employeesPageResponse);
      commit(GET_EMPLOYEES, employeesPageResponse.items);
      return employeesPageResponse;
    }).catch(err => {
      debugError(GET_EMPLOYEES, err.message, err.response.data.message);
      throw err;
    })
  },
  async [ADD_EMPLOYEE]({commit}, employeeWithRole) {
    await employeeApi.addEmployee(employeeWithRole)
      .then(() => {
        debug(ADD_EMPLOYEE, "Employee added", employeeWithRole);
        commit(ADD_EMPLOYEE, employeeWithRole.employee);
      }).catch(err => {
        debugError(ADD_EMPLOYEE, err.message, err.response.data.message);
        throw err;
      });
  }
};

const mutations = {
  [GET_EMPLOYEES](state, loadedEmployees) {
    state.loadedEmployees = loadedEmployees;
  },
  [CALLING_EMPLOYEE](state, employeeRole) {
    state.sessionEmployee = employeeRole.employee;
    state.sessionRoles = employeeRole.roles;
  },
  [ADD_EMPLOYEE](state, employee) {
    if (!state.isEmployeeFilterActive) {
      state.loadedEmployees = [employee, ...state.loadedEmployees];
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
