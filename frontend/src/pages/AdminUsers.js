import { useEffect, useState } from "react";
import { fetchAdminUsers, updateUserRole } from "../services/adminService";
import { getProfile } from "../services/authService";

const AdminUsers = () => {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setMe(profile);
        if (profile.role !== "admin") {
          setMsg("هذه الصفحة للمدير فقط.");
          return;
        }
        setUsers(await fetchAdminUsers());
      } catch {
        setMsg("تعذر تحميل البيانات");
      }
    })();
  }, []);

  const onChangeRole = async (id, role) => {
    try {
      const updated = await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setMsg("تم تحديث الدور بنجاح");
      setTimeout(() => setMsg(""), 1800);
    } catch {
      setMsg("فشل تحديث الدور");
    }
  };

  if (msg && !me)
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">{msg}</div>
      </div>
    );
  if (!me || !users)
    return <div className="container mt-5">جارٍ التحميل...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">إدارة المستخدمين</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد</th>
              <th>الدور</th>
              <th>تعديل</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge bg-secondary">{u.role}</span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    defaultValue={u.role}
                    onChange={(e) => onChangeRole(u._id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="lawyer">lawyer</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
