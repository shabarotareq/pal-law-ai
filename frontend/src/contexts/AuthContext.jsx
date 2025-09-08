// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// إنشاء Context
const AuthContext = createContext();

// خطاف لاستخدام بيانات المصادقة
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// مكون Provider لتوفير بيانات المصادقة
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // عملية تسجيل الدخول
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // عملية تسجيل الخروج
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // التحقق من وجود مستخدم مسجل عند تحميل التطبيق
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // قيمة البيانات المتاحة للمكونات
  const value = {
    user: currentUser, // للحفاظ على التوافق مع الكود القديم
    currentUser, // للتطبيقات الجديدة
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// تصدير Context للاستخدام المباشر إذا لزم الأمر
export { AuthContext };
