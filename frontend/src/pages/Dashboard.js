// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getProfile, logout } from "../services/authService";
import { useRouter } from "next/router";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch {
        router.push("/login"); // إعادة التوجيه لصفحة تسجيل الدخول عند الخطأ
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login"); // إعادة التوجيه بعد تسجيل الخروج
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        {/* رأس الصفحة */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">لوحة التحكم</h2>
            <p className="text-sm text-gray-600">مرحباً {user.name} 👋</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <span className="px-2 py-1 text-xs bg-gray-200 rounded">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* المكونات الداخلية للوحة */}
        <main className="flex-1">
          <DashboardRoutes />
        </main>
      </div>
    </ProtectedRoute>
  );
}
