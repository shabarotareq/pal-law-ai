import React, { useState } from "react";

const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      setLoading(false);
      return;
    }

    try {
      // محاكاة التسجيل
      setTimeout(() => {
        setLoading(false);
        alert("تم إنشاء الحساب بنجاح (محاكاة)");
      }, 1000);
    } catch (err) {
      setError("فشل في إنشاء الحساب");
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>إنشاء حساب جديد</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>الاسم الكامل</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>كلمة المرور</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>تأكيد كلمة المرور</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>
      </form>

      <div className="auth-links">
        <button type="button" onClick={onToggleMode} className="link-btn">
          لديك حساب بالفعل؟ تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default Register;
