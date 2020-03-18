import api from "./api";

const workloadRequestMapping = "/workload/requests";

export default {
  getInitiatedRequests: () =>
    api.get(`${workloadRequestMapping}/initiated`),
  getAssignedRequests: () =>
    api.get(`${workloadRequestMapping}/assigned`),
  addRequest: workloadRequestDto =>
    api.post(`${workloadRequestMapping}/add`, workloadRequestDto),
}