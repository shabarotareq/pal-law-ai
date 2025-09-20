// src/services/api.js
import axios from "axios";

// إنشاء مثيل Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // عدل الرابط حسب السيرفر عندك
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة Interceptor لإرسال التوكن مع كل طلب إذا كان موجود
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   دوال الـ ChatBot
================================ */
// إرسال رسالة
export async function sendMessage(message) {
  try {
    const response = await api.post("/chat/send", { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error.response?.data || { message: "فشل في إرسال الرسالة" };
  }
}

// جلب الرسائل
export async function getMessages() {
  try {
    const response = await api.get("/chat/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error.response?.data || { message: "فشل في جلب الرسائل" };
  }
}

/* ================================
   التصدير الافتراضي للمثيل
================================ */
export default api;
