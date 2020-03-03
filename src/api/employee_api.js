import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const employeeMapping = "/employees";
const employeeSkillsMapping = `${employeeMapping}/skills`;
const employeeSubdivisionsMapping = `${employeeMapping}/subdivisions`;
const employeePositionsMapping = `${employeeMapping}/positions`;

export default {
  getEmployeeRole: username =>
    api.get(`${employeeMapping}/users/${username}`),
  getEmployees: (page, size, order, orderBy) =>
    api.get(`${employeeMapping}`, paginationParams(page, size, order, orderBy)),
  filterEmployees: (page, size, order, orderBy, employeeFilter) =>
    api.post(`${employeeMapping}`, employeeFilter, paginationParams(page, size, order, orderBy)),
  addEmployee: employeeWithRoleDto =>
    api.put(`${employeeMapping}`, employeeWithRoleDto),
  updateEmployee: (id, updateEmployeeInfoDto) =>
    api.patch(`${employeeMapping}/${id}`, updateEmployeeInfoDto),
  deleteEmployee: id =>
    api.delete(`${employeeMapping}/${id}`),
  getEmployeeSkills: () =>
    api.get(`${employeeSkillsMapping}`),
  getEmployeeSubdivisions: () =>
    api.get(`${employeeSubdivisionsMapping}`),
  getEmployeePositions: () =>
    api.get(`${employeePositionsMapping}`),
}