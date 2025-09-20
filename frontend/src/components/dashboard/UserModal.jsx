import React, { useState } from "react";

const UserModal = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    active: user?.active ?? true,
    phone: user?.phone || "",
    specialization: user?.specialization || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{user ? "تعديل المستخدم" : "إضافة مستخدم جديد"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>الاسم الكامل</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
            <label>رقم الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>الدور</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">مستخدم</option>
              <option value="admin">مدير</option>
              <option value="lawyer">محامي</option>
              <option value="judge">قاضي</option>
              <option value="moderator">مشرف</option>
            </select>
          </div>
          {formData.role === "lawyer" && (
            <div className="form-group">
              <label>التخصص</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="التخصص القانوني"
              />
            </div>
          )}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
              حساب نشط
            </label>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
