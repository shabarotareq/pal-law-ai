import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في التسجيل");
    }
  };

  return (
    <div className="container mt-5">
      <h2>تسجيل حساب جديد</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="الاسم"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="email"
          type="email"
          placeholder="البريد الإلكتروني"
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="password"
          type="password"
          placeholder="كلمة المرور"
          onChange={handleChange}
        />
        <select
          className="form-control mb-2"
          name="role"
          onChange={handleChange}
        >
          <option value="user">مستخدم</option>
          <option value="lawyer">محامي</option>
          <option value="admin">مدير</option>
        </select>
        <button type="submit" className="btn btn-primary">
          تسجيل
        </button>
      </form>
    </div>
  );
};

export default Register;
