import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const activityMapping = "/activities";

export default {
  getActivities: (page, size, order, orderBy) => api.get(`${activityMapping}`, paginationParams(page, size, order, orderBy)),
  getActivity: id => api.get(`${activityMapping}/${id}`),
  addActivity: activityDto => api.post(`${activityMapping}/add`, activityDto),
  updateActivity: (id, activityDto) => api.post(`${activityMapping}/${id}/update`, activityDto),
  deleteActivity: id => api.delete(`${activityMapping}/${id}`)
}