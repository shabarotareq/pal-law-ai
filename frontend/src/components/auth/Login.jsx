import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

import { login } from "../../services/auth";

const Login = ({ onToggleMode, onForgotPassword }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(credentials);
      setUser(user);
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    // خاصية الدخول السريع بالضغط على F10 (لتطوير فقط)
    setCredentials({
      email: "admin@example.com",
      password: "admin123",
    });
  };

  return (
    <div className="auth-form">
      <h2>تسجيل الدخول</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>كلمة المرور</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
        </button>
      </form>

      <div className="auth-links">
        <button type="button" onClick={onForgotPassword} className="link-btn">
          نسيت كلمة المرور؟
        </button>
        <button type="button" onClick={onToggleMode} className="link-btn">
          إنشاء حساب جديد
        </button>
      </div>

      <div className="quick-login-hint">
        <small>لتجربة سريعة: اضغط F10 لملئ بيانات الدخول تلقائياً</small>
      </div>
    </div>
  );
};

export default Login;
