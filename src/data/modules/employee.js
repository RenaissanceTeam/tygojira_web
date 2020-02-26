import {
  CALLING_EMPLOYEE,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_EMPLOYEES,
  BUSINESS_ROLE,
  SELECT_EMPLOYEE,
  UNSELECT_EMPLOYEE,
  SELECT_PAGE,
  FILTER_EMPLOYEES,
  EMPLOYEES_PER_PAGE
} from "../constants/employee_constants";
import employeeApi from "../../api/employee_api";
import {debug, debugError} from "../../utils/logging";
import {
  EmployeeDto,
  EmployeeWithRoleDto,
  EMPTY_EMPLOYEE_DTO,
  EMPTY_FULL_EMPLOYEE_INFO_DTO,
  FullEmployeeInfoDtoFields
} from "../dto/employee_dto";
import {Order} from "../dto/pagination_dto";

const state = {
  sessionEmployee: EMPTY_EMPLOYEE_DTO,
  sessionRoles: [],

  currentPage: 0,
  totalEmployees: 0,
  totalPages: 0,
  loadedEmployees: [],
  selectedEmployee: EMPTY_FULL_EMPLOYEE_INFO_DTO,
};

const getters = {
  sessionEmployee: state => state.sessionEmployee,

  isEmployee:      state => state.sessionRoles.includes(BUSINESS_ROLE.EMPLOYEE),
  isProjectLead:   state => state.sessionRoles.includes(BUSINESS_ROLE.PROJECT_LEAD),
  isLinearLead:    state => state.sessionRoles.includes(BUSINESS_ROLE.LINEAR_LEAD),
  isProjectOffice: state => state.sessionRoles.includes(BUSINESS_ROLE.PROJECT_OFFICE),

  currentPage:        state => state.currentPage,
  totalEmployees:     state => state.totalEmployees,
  totalPages:         state => state.totalPages,
  loadedEmployees:    state => state.loadedEmployees,
  isEmployeeSelected: state => state.selectedEmployee === EMPTY_FULL_EMPLOYEE_INFO_DTO,
  selectedEmployee:   state => state.selectedEmployee,

  employeePermissions: (state, rootGetters) => {
    return {
      [CALLING_EMPLOYEE]: rootGetters.isAuthenticated,
      [GET_EMPLOYEES]:   rootGetters.isAuthenticated,
      [ADD_EMPLOYEE]:    rootGetters.isLinearLead || rootGetters.isAdmin,
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

        if (rootGetters.isUser) throw err;

        commit(CALLING_EMPLOYEE, new EmployeeWithRoleDto(
          new EmployeeDto(
            username,
            username,
            rootGetters.systemUserRole,
            username,
            "",
            "",
            []
          ),
          []
        ));
      });
  },
  async [GET_EMPLOYEES]({commit}, page) {
    employeeApi.getEmployees(
      page - 1,
      EMPLOYEES_PER_PAGE,
      Order.ASCENDING,
      [
        FullEmployeeInfoDtoFields.lastName,
        FullEmployeeInfoDtoFields.firstName,
        FullEmployeeInfoDtoFields.middleName
      ]
    ).then(response => {
      const employeesPageResponse = response.data;
      debug(GET_EMPLOYEES, "employeesPageResponse:", employeesPageResponse);
      commit(GET_EMPLOYEES, employeesPageResponse);
    }).catch(err => {
      debugError(GET_EMPLOYEES, err.message, err.response.data.message);
      throw err;
    })
  },
  async [FILTER_EMPLOYEES]({commit}, employeeFilter) {
    employeeApi.filterEmployees(
      0,
      EMPLOYEES_PER_PAGE,
      Order.ASCENDING,
      [
        FullEmployeeInfoDtoFields.lastName,
        FullEmployeeInfoDtoFields.firstName,
        FullEmployeeInfoDtoFields.middleName
      ],
      employeeFilter
    ).then(response => {
      const employeesPageResponse = response.data;
      debug(FILTER_EMPLOYEES, "employeesPageResponse", employeesPageResponse);
      commit(FILTER_EMPLOYEES, employeesPageResponse);
    }).catch(err => {
      debugError(FILTER_EMPLOYEES, err.message, err.response.data.message);
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
  },
  async [DELETE_EMPLOYEE]({commit}, employee) {
    await employeeApi.deleteEmployee(employee.id)
      .then(() => {
        debug(DELETE_EMPLOYEE, "Employee deleted", employee);
        commit(DELETE_EMPLOYEE, employee)
      }).catch(err => {
        debugError(DELETE_EMPLOYEE, err.message, err.response.data.message);
        throw err;
      });
  },
  async [SELECT_EMPLOYEE]({commit}, selectedEmployee) {
    debug(SELECT_EMPLOYEE, selectedEmployee);
    commit(SELECT_EMPLOYEE, selectedEmployee)
  },
  async [UNSELECT_EMPLOYEE]({commit}) {
    debug(UNSELECT_EMPLOYEE);
    commit(UNSELECT_EMPLOYEE);
  },
  async [SELECT_PAGE]({commit}, page) {
    debug(SELECT_PAGE, page);
    commit(SELECT_PAGE, page);
  }
};

const mutations = {
  [GET_EMPLOYEES](state, employeesPageResponse) {
    state.loadedEmployees = employeesPageResponse.items;
    state.totalEmployees = employeesPageResponse.totalItems;
    state.currentPage = employeesPageResponse.currentPage + 1;
    state.totalPages = employeesPageResponse.totalPages;
  },
  [FILTER_EMPLOYEES](state, employeesPageResponse) {
    state.loadedEmployees = employeesPageResponse.items;
    state.totalEmployees = employeesPageResponse.totalItems;
    state.currentPage = employeesPageResponse.currentPage + 1;
    state.totalPages = employeesPageResponse.totalPages;
  },
  [CALLING_EMPLOYEE](state, employeeRole) {
    state.sessionEmployee = employeeRole.employee;
    state.sessionRoles = employeeRole.roles;
  },
  [ADD_EMPLOYEE](state, employee) {
    state.loadedEmployees = [employee, ...state.loadedEmployees];
    state.totalEmployees++;
  },
  [DELETE_EMPLOYEE](state, deletedEmployee) {
    state.loadedEmployees.splice(state.loadedEmployees.indexOf(deletedEmployee), 1);
    state.totalEmployees--;
  },
  [SELECT_EMPLOYEE](state, selectedEmployee) {
    state.selectedEmployee = selectedEmployee;
  },
  [UNSELECT_EMPLOYEE](state) {
    state.selectedEmployee = EMPTY_FULL_EMPLOYEE_INFO_DTO;
  },
  [SELECT_PAGE](state, page) {
    state.currentPage = page;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
