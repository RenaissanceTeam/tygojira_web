import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const employeeMapping = "/employees";

export default {
  getEmployeeRole: username =>
    api.get(`${employeeMapping}/users/${username}`),
  getEmployees: (page, size, order, orderBy) =>
    api.get(`${employeeMapping}`, paginationParams(page, size, order, orderBy)),
  filterEmployees: (page, size, order, orderBy, employeeFilter) =>
    api.post(`${employeeMapping}`, employeeFilter, paginationParams(page, size, order, orderBy)),
  addEmployee: employeeWithRoleDto =>
    api.post(`${employeeMapping}/add`, employeeWithRoleDto),
  updateEmployee: (id, updateEmployeeInfoDto) =>
    api.post(`${employeeMapping}/${id}/update`, updateEmployeeInfoDto),
  deleteEmployee: id =>
    api.delete(`${employeeMapping}/${id}`)
}