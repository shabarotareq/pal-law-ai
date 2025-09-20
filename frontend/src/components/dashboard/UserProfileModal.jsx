import React from "react";

const UserProfileModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>الملف الشخصي - {user.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="profile-content">
          <div className="profile-section">
            <h4>المعلومات الأساسية</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>الاسم الكامل:</label>
                <span>{user.name}</span>
              </div>
              <div className="info-item">
                <label>البريد الإلكتروني:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>رقم الهاتف:</label>
                <span>{user.phone || "غير محدد"}</span>
              </div>
              <div className="info-item">
                <label>الدور:</label>
                <span className={`role-badge role-${user.role}`}>
                  {user.role === "admin"
                    ? "مدير"
                    : user.role === "lawyer"
                    ? "محامي"
                    : user.role === "judge"
                    ? "قاضي"
                    : user.role === "moderator"
                    ? "مشرف"
                    : "مستخدم"}
                </span>
              </div>
              <div className="info-item">
                <label>الحالة:</label>
                <span
                  className={`status-badge ${
                    user.active ? "active" : "inactive"
                  }`}
                >
                  {user.active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </div>
          </div>

          {user.specialization && (
            <div className="profile-section">
              <h4>المعلومات المهنية</h4>
              <div className="info-item">
                <label>التخصص:</label>
                <span>{user.specialization}</span>
              </div>
            </div>
          )}

          <div className="profile-section">
            <h4>الإحصائيات والنشاط</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <label>تاريخ الانضمام:</label>
                <span>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("ar-SA")
                    : "غير متوفر"}
                </span>
              </div>
              <div className="stat-item">
                <label>آخر دخول:</label>
                <span>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString("ar-SA")
                    : "لم يدخل بعد"}
                </span>
              </div>
              <div className="stat-item">
                <label>عدد الجلسات:</label>
                <span>{user.sessionCount || 0}</span>
              </div>
              <div className="stat-item">
                <label>آخر نشاط:</label>
                <span>{user.lastActivity || "لا يوجد نشاط"}</span>
              </div>
            </div>
          </div>

          {(user.experience || user.education) && (
            <div className="profile-section">
              <h4>الخبرة والتعليم</h4>
              <div className="info-grid">
                {user.experience && (
                  <div className="info-item">
                    <label>الخبرة:</label>
                    <span>{user.experience}</span>
                  </div>
                )}
                {user.education && (
                  <div className="info-item">
                    <label>التعليم:</label>
                    <span>{user.education}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {user.bio && (
            <div className="profile-section">
              <h4>نبذة عني</h4>
              <div className="bio-content">
                <p>{user.bio}</p>
              </div>
            </div>
          )}

          <div className="profile-section">
            <h4>الإعدادات والتفضيلات</h4>
            <div className="settings-grid">
              <div className="setting-item">
                <label>الإشعارات البريدية:</label>
                <span
                  className={
                    user.emailNotifications ? "setting-on" : "setting-off"
                  }
                >
                  {user.emailNotifications ? "مفعلة" : "معطلة"}
                </span>
              </div>
              <div className="setting-item">
                <label>الإشعارات المنبثقة:</label>
                <span
                  className={
                    user.pushNotifications ? "setting-on" : "setting-off"
                  }
                >
                  {user.pushNotifications ? "مفعلة" : "معطلة"}
                </span>
              </div>
              <div className="setting-item">
                <label>وضع التخفي:</label>
                <span
                  className={user.isInvisible ? "setting-on" : "setting-off"}
                >
                  {user.isInvisible ? "مفعل" : "معطل"}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              إغلاق
            </button>
            <button className="btn btn-primary">تحرير الملف الشخصي</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
