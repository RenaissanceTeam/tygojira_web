import api from "./api";

const employeeMapping = "/employees";

export default {
  getEmployeeRole: username => api.get(`${employeeMapping}/users/${username}`)
}