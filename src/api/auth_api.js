import api from "./api";

export default {
  login: credentials => api.post("/login", credentials),
  systemUserRole: () => api.get("/auth/role")
}