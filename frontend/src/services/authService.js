import api from "./api"; // ملف api مخصص للاتصال بـ backend عبر axios

/* ================================
   تسجيل مستخدم جديد
================================ */
export async function register(userData) {
  try {
    const res = await api.post("/auth/register", userData);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "فشل في تسجيل المستخدم" };
  }
}

/* ================================
   تسجيل الدخول
================================ */
export async function login(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "فشل تسجيل الدخول" };
  }
}

/* ================================
   تسجيل الخروج
================================ */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/* ================================
   جلب الملف الشخصي
================================ */
export async function getProfile() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("غير مصرح");

    const res = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // حفظ بيانات المستخدم محليًا
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    logout(); // في حالة انتهاء الصلاحية أو الخطأ
    throw err.response?.data || { message: "فشل في جلب البيانات" };
  }
}

/* ================================
   استرجاع بيانات المستخدم من LocalStorage
================================ */
export function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
