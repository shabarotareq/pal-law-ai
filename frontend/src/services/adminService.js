import API from "./api";

export const fetchAdminUsers = async () => (await API.get("/admin/users")).data;
export const updateUserRole = async (id, role) =>
  (await API.put(`/admin/users/${id}/role`, { role })).data;

export const fetchAdminCases = async (params = {}) =>
  (await API.get("/admin/cases", { params })).data;
export const fetchAdminStats = async () => (await API.get("/admin/stats")).data;

export const fetchAudits = async (params = {}) =>
  (await API.get("/admin/audits", { params })).data;

{
  /* القضايا */
}
export const getAllCases = async () => {
  const res = await API.get("/admin/cases");
  return res.data;
};

export const getCasesStats = async () => {
  const res = await API.get("/admin/cases/stats");
  return res.data;
};

{
  /* المستخدمين */
}
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};
