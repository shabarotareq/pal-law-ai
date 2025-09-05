import api from "./api";

export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (userData) => api.post("/auth/register", userData);
export const getCurrentUser = () => api.get("/auth/me");
export const logout = () => {
  localStorage.removeItem("token");
  return Promise.resolve();
};
