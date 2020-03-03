import {
  CALLING_EMPLOYEE,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_EMPLOYEES,
  BUSINESS_ROLE,
  GET_EMPLOYEE_POSITIONS,
  GET_EMPLOYEE_SUBDIVISIONS,
  GET_EMPLOYEE_SKILLS
} from "../constants/employee_constants";
import employeeApi from "../../api/employee_api";
import {debug, debugError} from "../../utils/logging";
import {
  EmployeeDto,
  EmployeeWithRoleDto,
  EMPTY_EMPLOYEE_DTO
} from "../dto/employee_dto";

const state = {
  sessionEmployee: EMPTY_EMPLOYEE_DTO,
  sessionRoles: [],

  employeeSubdivisions: [],
  employeePositions: [],
  employeeSkills: [],
};

const getters = {
  sessionEmployee: state => state.sessionEmployee,

  employeeSubdivisions: state => state.employeeSubdivisions,
  employeePositions: state => state.employeePositions,
  employeeSkills: state => state.employeeSkills,

  isEmployee:      state => state.sessionRoles.includes(BUSINESS_ROLE.EMPLOYEE),
  isProjectLead:   state => state.sessionRoles.includes(BUSINESS_ROLE.PROJECT_LEAD),
  isLinearLead:    state => state.sessionRoles.includes(BUSINESS_ROLE.LINEAR_LEAD),
  isProjectOffice: state => state.sessionRoles.includes(BUSINESS_ROLE.PROJECT_OFFICE),

  employeePermissions: (state, rootGetters) => {
    return {
      [CALLING_EMPLOYEE]: rootGetters.isAuthenticated,
      [GET_EMPLOYEES]:    rootGetters.isAuthenticated,
      [ADD_EMPLOYEE]:     rootGetters.isLinearLead || rootGetters.isAdmin,
      [UPDATE_EMPLOYEE]:  rootGetters.isLinearLead,
      [DELETE_EMPLOYEE]:  rootGetters.isLinearLead
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
  async [GET_EMPLOYEE_POSITIONS]({commit}) {
    await employeeApi.getEmployeePositions()
      .then(response => {
        const positionsDtoResponse = response.data;
        debug(GET_EMPLOYEE_POSITIONS, "positionsDtoResponse:", positionsDtoResponse);
        commit(GET_EMPLOYEE_POSITIONS, positionsDtoResponse);
      }).catch(err => {
        debugError(GET_EMPLOYEE_POSITIONS, err.message, err.response.data.message);
        throw err;
      })
  },
  async [GET_EMPLOYEE_SUBDIVISIONS]({commit}) {
    await employeeApi.getEmployeeSubdivisions()
      .then(response => {
        const subdivisionsDtoResponse = response.data;
        debug(GET_EMPLOYEE_SUBDIVISIONS, "subdivisionsDtoResponse:", subdivisionsDtoResponse);
        commit(GET_EMPLOYEE_SUBDIVISIONS, subdivisionsDtoResponse);
      }).catch(err => {
        debugError(GET_EMPLOYEE_SUBDIVISIONS, err.message, err.response.data.message);
        throw err;
      })
  },
  async [GET_EMPLOYEE_SKILLS]({commit}) {
    await employeeApi.getEmployeeSkills()
      .then(response => {
        const skillsDtoResponse = response.data;
        debug(GET_EMPLOYEE_SKILLS, "skillsDtoResponse:", skillsDtoResponse);
        commit(GET_EMPLOYEE_SKILLS, skillsDtoResponse);
      }).catch(err => {
        debugError(GET_EMPLOYEE_SKILLS, err.message, err.response.data.message);
        throw err;
      })
  },
};

const mutations = {
  [CALLING_EMPLOYEE](state, employeeRole) {
    state.sessionEmployee = employeeRole.employee;
    state.sessionRoles = employeeRole.roles;
  },
  [GET_EMPLOYEE_SUBDIVISIONS](state, subdivisionsDtoResponse) {
    state.employeeSubdivisions = subdivisionsDtoResponse.subdivisions;
  },
  [GET_EMPLOYEE_POSITIONS](state, positionsDtoResponse) {
    state.employeePositions = positionsDtoResponse.positions;
  },
  [GET_EMPLOYEE_SKILLS](state, skillsDtoResponse) {
    state.employeeSkills = skillsDtoResponse.skills;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
