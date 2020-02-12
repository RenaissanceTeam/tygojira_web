import api from "./api";

const employeeMapping = "/employees";

export default {
  getEmployeeRole: username => api.get(`${employeeMapping}/users/${username}`),
  getEmployees: pageRequest => api.post(`${employeeMapping}`, pageRequest),
  addEmployee: employeeWithRoleDto => api.post(`${employeeMapping}/add`, employeeWithRoleDto),
  updateEmployee: (id, updateEmployeeInfoDto) => api.post(`${employeeMapping}/${id}/update`, updateEmployeeInfoDto),
  deleteEmployee: id => api.delete(`${employeeMapping}/${id}`)
}