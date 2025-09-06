{
  /* تسجيل مستخدم جديد */
}
export const register = async (userData) => {
  const res = await API.post("/auth/register", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

{
  /* تسجيل الدخول */
}
export const login = async (userData) => {
  const res = await API.post("/auth/login", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

{
  /* جلب الملف الشخصي */
}
export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};

{
  /* تسجيل الخروج*/
}
export const logout = () => {
  localStorage.removeItem("token");
};
