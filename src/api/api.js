import axios from 'axios'
import {apiUrl} from "../data/constants/env_constants"

const api = axios.create({
  baseURL: apiUrl
});

export default api;