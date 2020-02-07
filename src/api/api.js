import axios from 'axios'
import {apiUrl} from "../data/constants/env_constants"

const api = axios.create({
  baseURL: apiUrl
});

export function cleanAuthorizationHeader() {
  delete api.defaults.headers.common['Authorization'];
}

export function setAuthorizationHeader(header) {
  api.defaults.headers.common['Authorization'] = header;
}

export default api;