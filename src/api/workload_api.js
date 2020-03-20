import api from "./api";

const workloadRequestMapping = "/workload/requests";

export default {
  getInitiatedRequests: () =>
    api.get(`${workloadRequestMapping}/initiated`),
  getAssignedRequests: () =>
    api.get(`${workloadRequestMapping}/assigned`),
  addRequest: workloadRequestDto =>
    api.post(`${workloadRequestMapping}/add`, workloadRequestDto),
  redirectRequest: id =>
    api.post(`${workloadRequestMapping}/${id}/redirect`),
  rejectRequest: id =>
    api.post(`${workloadRequestMapping}/${id}/reject`),
  satisfyRequest: (id, employeeIdDto) =>
    api.post(`${workloadRequestMapping}/${id}/satisfy`, employeeIdDto),
  pendingRequest: id =>
    api.post(`${workloadRequestMapping}/${id}/pending`),
}