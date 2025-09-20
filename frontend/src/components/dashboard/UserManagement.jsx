import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
} from "../../services/users";
import { useAuthUser, useIsAuthenticated } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import UserModal from "./UserModal";
import UserProfileModal from "./UserProfileModal";
import "./UserManagement.css";

const UserManagement = () => {
  const authUser = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";

      if (sortBy === "createdAt" || sortBy === "lastLogin") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      setShowModal(false);
      loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await updateUser(id, userData);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
      )
    ) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSuspendUser = async (id) => {
    try {
      await suspendUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleActivateUser = async (id) => {
    try {
      await activateUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="جاري تحميل المستخدمين..." />
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* رأس الصفحة */}
      <div className="page-header">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
          <p className="text-gray-600">
            إدارة حسابات مستخدمي المنصة والصلاحيات
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <span className="mr-2">+</span>
          إضافة مستخدم جديد
        </button>
      </div>

      {/* أدوات التصفية والبحث */}
      {/* ... (نفس الكود السابق) */}

      {/* جدول المستخدمين */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th onClick={() => handleSort("email")}>
                البريد الإلكتروني{" "}
                {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("role")}>
                الدور {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("lastLogin")}>
                آخر دخول{" "}
                {sortBy === "lastLogin" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("active")}>
                الحالة{" "}
                {sortBy === "active" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  لا توجد نتائج تطابق معايير البحث
                </td>
              </tr>
            ) : (
              currentItems.map((user) => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-info">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    {user.lastLogin ? (
                      new Date(user.lastLogin).toLocaleDateString("ar-SA")
                    ) : (
                      <span className="text-gray-400">لم يدخل بعد</span>
                    )}
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
                        onClick={() => handleViewProfile(user)}
                        title="عرض الملف الشخصي"
                      >
                        👁️
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => setEditingUser(user)}
                        title="تعديل"
                      >
                        ✏️
                      </button>
                      {user.id !== authUser?.id && (
                        <>
                          {user.active ? (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleSuspendUser(user.id)}
                              title="تعطيل"
                            >
                              ⏸️
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleActivateUser(user.id)}
                              title="تفعيل"
                            >
                              ▶️
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="حذف"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* المودالات تبقى كما هي */}
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

      {showProfileModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

// دالة مساعدة للحصول على تسمية الدور
const getRoleLabel = (role) => {
  const roles = {
    admin: "مدير",
    user: "مستخدم",
    lawyer: "محامي",
    judge: "قاضي",
    moderator: "مشرف",
  };
  return roles[role] || role;
};

export default UserManagement;
