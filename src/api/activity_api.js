import api from "./api";
import {paginationParams} from "../data/dto/pagination_dto";

const activityMapping = "/activities";

export default {
  getActivities: (page, size, order, orderBy) =>
    api.get(`${activityMapping}`, paginationParams(page, size, order, orderBy)),
  getActivity: id =>
    api.get(`${activityMapping}/${id}`),
  addActivity: activityDto =>
    api.put(`${activityMapping}`, activityDto),
  updateActivity: (id, activityDto) =>
    api.patch(`${activityMapping}/${id}`, activityDto),
  deleteActivity: id =>
    api.delete(`${activityMapping}/${id}`)
}