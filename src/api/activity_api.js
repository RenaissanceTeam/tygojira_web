import api from "./api";

const activityMapping = "/activities";

export default {
  getActivities: pageRequest => api.post(`${activityMapping}`, pageRequest),
  getActivity: id => api.get(`${activityMapping}/${id}`),
  addActivity: activityDto => api.post(`${activityMapping}/add`, activityDto),
  updateActivity: (id, activityDto) => api.post(`${activityMapping}/${id}/update`, activityDto),
  deleteActivity: id => api.delete(`${activityMapping}/${id}`)
}