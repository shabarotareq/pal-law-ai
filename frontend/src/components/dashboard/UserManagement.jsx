import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/users";
import { useAuth } from "../../hooks/useAuth";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await updateUser(id, userData);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;

  return (
    <div className="user-management">
      <div className="page-header">
        <h2>إدارة المستخدمين</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + إضافة مستخدم
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="user-avatar-small"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === "admin" ? "مدير" : "مستخدم"}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      user.active ? "active" : "inactive"
                    }`}
                  >
                    {user.active ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setEditingUser(user)}
                    >
                      تعديل
                    </button>
                    {user.id !== currentUser.id && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserModal
          user={null}
          onSubmit={handleCreateUser}
          onClose={() => setShowModal(false)}
        />
      )}

      {editingUser && (
        <UserModal
          user={editingUser}
          onSubmit={(data) => handleUpdateUser(editingUser.id, data)}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

const UserModal = ({ user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "user",
    active: user?.active ?? true,
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
            <label>الاسم</label>
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
            <label>الدور</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">مستخدم</option>
              <option value="admin">مدير</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
              نشط
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn-primary">
              {user ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
