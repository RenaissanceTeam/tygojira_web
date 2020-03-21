export const ADD_WORKLOAD_REQUEST = "ADD_WORKLOAD_REQUEST";
export const GET_INITIATED_REQUESTS = "GET_INITIATED_REQUESTS";
export const GET_ASSIGNED_REQUESTS = "GET_ASSIGNED_REQUESTS";
export const REDIRECT_REQUEST = "REDIRECT_REQUEST";
export const SATISFY_REQUEST = "SATISFY_REQUEST";
export const REJECT_REQUEST = "REJECT_REQUEST";
export const PENDING_REQUEST = "PENDING_REQUEST";

export const WorkloadRequestStatus = {
  NEW: "NEW",
  SENT: "SENT",
  REDIRECTED: "REDIRECTED",
  SATISFIED: "SATISFIED",
  REJECTED: "REJECTED",
  PENDING: "PENDING"
};