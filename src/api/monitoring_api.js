import api from "./api";

const monitoringApi = "/monitoring";

export default {
  getEmployeeActivitiesWorkloads: employeeId =>
    api.get(`${monitoringApi}/employee/${employeeId}/workload`),
}