import API from "./api";

export const createCase = async (data, isFormData = false) => {
  const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
  const res = await API.post("/cases", data, { headers });
  return res.data;
};

export const getCases = async (params = {}) => {
  const res = await API.get("/cases", { params });
  return res.data;
};

export const softDeleteCase = async (id) =>
  (await API.patch(`/cases/${id}/soft-delete`)).data;
export const restoreCase = async (id) =>
  (await API.patch(`/cases/${id}/restore`)).data;
export const hardDeleteCase = async (id) =>
  (await API.delete(`/cases/${id}`)).data;
