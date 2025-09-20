// src/pages/Cases.js
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { getProfile, logout } from "../services/authService";
import { useRouter } from "next/router";
import {
  getCases,
  createCase,
  softDeleteCase,
  restoreCase,
} from "../services/caseService";
import { exportCasesToExcel, exportCasesToPDF } from "../utils/exporters";

export default function Cases() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    lawType: "جنائي",
  });
  const [filters, setFilters] = useState({
    q: "",
    lawType: "",
    from: "",
    to: "",
  });
  const [error, setError] = useState("");

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

  // تحميل القضايا
  const loadCases = async () => {
    try {
      const data = await getCases(filters);
      setCases(data);
    } catch {
      setError("فشل في جلب القضايا");
    }
  };

  useEffect(() => {
    loadCases();
  }, []); // eslint-disable-line

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiltersChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCase = await createCase(form);
      setCases([...cases, newCase]);
      setForm({ title: "", description: "", lawType: "جنائي" });
    } catch {
      setError("فشل في إضافة القضية");
    }
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    await loadCases();
  };

  const exportRows = cases.map((c) => ({
    title: c.title,
    lawType: c.lawType,
    description: c.description,
    createdAt: c.createdAt,
  }));

  if (!user) {
    return <p className="text-center mt-10">جاري تحميل البيانات...</p>;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        {/* رأس الصفحة */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">لوحة التحكم - إدارة القضايا</h2>
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
          {error && <p className="text-red-500">{error}</p>}

          {/* نموذج إضافة قضية */}
          <form onSubmit={handleSubmit} className="mb-4 space-y-2">
            <input
              className="w-full p-2 border rounded"
              name="title"
              placeholder="عنوان القضية"
              value={form.title}
              onChange={handleChange}
            />
            <textarea
              className="w-full p-2 border rounded"
              name="description"
              placeholder="وصف القضية"
              value={form.description}
              onChange={handleChange}
            />
            <select
              className="w-full p-2 border rounded"
              name="lawType"
              value={form.lawType}
              onChange={handleChange}
            >
              <option value="جنائي">جنائي</option>
              <option value="مدني">مدني</option>
              <option value="شرعي">شرعي</option>
              <option value="عمل">عمل</option>
              <option value="جرائم إلكترونية">جرائم إلكترونية</option>
              <option value="ضرائب">ضرائب</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              إضافة قضية
            </button>
          </form>

          {/* نموذج الفلاتر */}
          <form
            className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3"
            onSubmit={applyFilters}
          >
            <input
              className="p-2 border rounded"
              name="q"
              placeholder="بحث نصي"
              value={filters.q}
              onChange={handleFiltersChange}
            />
            <select
              className="p-2 border rounded"
              name="lawType"
              value={filters.lawType}
              onChange={handleFiltersChange}
            >
              <option value="">كل الأنواع</option>
              <option value="جنائي">جنائي</option>
              <option value="مدني">مدني</option>
              <option value="شرعي">شرعي</option>
              <option value="عمل">عمل</option>
              <option value="جرائم إلكترونية">جرائم إلكترونية</option>
              <option value="ضرائب">ضرائب</option>
            </select>
            <input
              type="date"
              className="p-2 border rounded"
              name="from"
              value={filters.from}
              onChange={handleFiltersChange}
            />
            <input
              type="date"
              className="p-2 border rounded"
              name="to"
              value={filters.to}
              onChange={handleFiltersChange}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              تطبيق
            </button>
          </form>

          {/* أزرار التصدير */}
          <div className="mb-3 flex gap-2">
            <button
              className="px-4 py-2 border rounded hover:bg-green-100"
              onClick={() => exportCasesToExcel(exportRows, "cases.xlsx")}
            >
              تصدير Excel
            </button>
            <button
              className="px-4 py-2 border rounded hover:bg-red-100"
              onClick={() => exportCasesToPDF(exportRows, "cases.pdf")}
            >
              تصدير PDF
            </button>
          </div>

          {/* قائمة القضايا */}
          <ul className="space-y-2">
            {cases.length > 0 ? (
              cases.map((c) => (
                <li key={c._id} className="p-4 border rounded">
                  <h4 className="font-semibold">
                    {c.title}{" "}
                    <span className="text-sm text-gray-500">({c.lawType})</span>
                    {c.deletedAt && (
                      <span className="ml-2 px-2 py-1 bg-red-200 text-red-800 text-xs rounded">
                        محذوفة
                      </span>
                    )}
                  </h4>
                  <p>{c.description}</p>
                  <small className="text-gray-400">
                    تم الإنشاء: {new Date(c.createdAt).toLocaleString()}
                  </small>
                  <div className="mt-2 flex gap-2">
                    {!c.deletedAt ? (
                      <button
                        className="px-2 py-1 bg-yellow-400 text-white rounded text-sm"
                        onClick={async () => {
                          await softDeleteCase(c._id);
                          setCases((prev) =>
                            prev.map((x) =>
                              x._id === c._id
                                ? { ...x, deletedAt: new Date().toISOString() }
                                : x
                            )
                          );
                        }}
                      >
                        حذف (Soft)
                      </button>
                    ) : (
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                        onClick={async () => {
                          await restoreCase(c._id);
                          setCases((prev) =>
                            prev.map((x) =>
                              x._id === c._id ? { ...x, deletedAt: null } : x
                            )
                          );
                        }}
                      >
                        استعادة
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p>لا توجد قضايا بعد.</p>
            )}
          </ul>
        </main>
      </div>
    </ProtectedRoute>
  );
}
