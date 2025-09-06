import { useEffect, useState } from "react";
import {
  getAllCases,
  getCasesStats,
  getAllUsers,
  deleteUser,
} from "../services/adminService";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#d88484",
];

const AdminDashboard = () => {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setCases(await getAllCases());
      setStats(await getCasesStats());
      setUsers(await getAllUsers());
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div className="container mt-5">
      <h2>لوحة تحكم المدير</h2>

      {/* إحصائيات */}
      <div className="my-4">
        <h4>إحصائيات القضايا حسب النوع</h4>
        <PieChart width={400} height={300}>
          <Pie
            data={stats}
            dataKey="count"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {stats.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* جميع القضايا */}
      <h4>جميع القضايا</h4>
      <ul className="list-group mb-4">
        {cases.map((c) => (
          <li key={c._id} className="list-group-item">
            <strong>{c.title}</strong> - {c.lawType} <br />
            <small>
              بواسطة: {c.user?.name} ({c.user?.email})
            </small>
          </li>
        ))}
      </ul>

      {/* جميع المستخدمين */}
      <h4>إدارة المستخدمين</h4>
      <table className="table">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الدور</th>
            <th>تحكم</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteUser(u._id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
