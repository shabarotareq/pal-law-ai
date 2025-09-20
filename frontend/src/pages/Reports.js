// src/pages/Reports.js
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { getProfile, logout } from "../services/authService";
import { useRouter } from "next/router";

export default function Reports() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch {
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return <p className="text-center mt-10">جاري تحميل البيانات...</p>;

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        {/* رأس الصفحة */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">لوحة التحكم - التقارير</h2>
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

        {/* محتوى الصفحة */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">التقارير</h2>
          <p className="text-gray-600 mb-4">
            هنا يمكنك مشاهدة التقارير الخاصة بالقضايا والإحصائيات.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-semibold">عدد القضايا</h3>
              <p className="text-xl font-bold mt-2">123</p>
            </div>
            <div className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-semibold">القضايا النشطة</h3>
              <p className="text-xl font-bold mt-2">45</p>
            </div>
            <div className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-semibold">القضايا المغلقة</h3>
              <p className="text-xl font-bold mt-2">78</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
