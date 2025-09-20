import { useState } from "react";
import { useRouter } from "next/router";
import { register } from "../services/authService";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // تحديث الحقول
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // تسجيل مستخدم جديد
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form); // استدعاء دالة register من authService
      router.push("/Dashboard"); // بعد التسجيل روح للـ Dashboard
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "فشل في تسجيل الحساب"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل حساب جديد</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="الاسم الكامل"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="user">مستخدم</option>
            <option value="lawyer">محامي</option>
            <option value="admin">مدير</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "جاري التسجيل..." : "تسجيل"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          لديك حساب بالفعل؟{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            تسجيل الدخول
          </span>
        </p>
      </div>
    </div>
  );
}
