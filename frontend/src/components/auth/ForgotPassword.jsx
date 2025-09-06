import React, { useState } from "react";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // محاكاة إرسال رابط إعادة التعيين
      setTimeout(() => {
        setLoading(false);
        setMessage(
          "إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين"
        );
      }, 1000);
    } catch (err) {
      setMessage("حدث خطأ أثناء معالجة الطلب");
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>استعادة كلمة المرور</h2>

      {message && (
        <div
          className={
            message.includes("خطأ") ? "error-message" : "success-message"
          }
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "جاري الإرسال..." : "إرسال رابط التعيين"}
        </button>
      </form>

      <div className="auth-links">
        <button type="button" onClick={onBackToLogin} className="link-btn">
          العودة إلى تسجيل الدخول
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
