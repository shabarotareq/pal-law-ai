import api from "./api";

export const getUsers = () => {
  return api.get("/users").then((response) => response.data.users);
};

export const getUser = (id) => {
  return api.get(`/users/${id}`).then((response) => response.data.user);
};

export const createUser = (userData) => {
  return api.post("/users", userData).then((response) => response.data);
};

export const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData).then((response) => response.data);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`).then((response) => response.data);
};

export const updateProfile = (userData) => {
  return api.put("/users/profile", userData).then((response) => response.data);
};
