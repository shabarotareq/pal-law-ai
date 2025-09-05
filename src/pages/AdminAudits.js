import { useEffect, useState } from "react";
import { fetchAudits } from "../services/adminService";
import { getProfile } from "../services/authService";

const AdminAudits = () => {
  const [me, setMe] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await getProfile();
      setMe(p);
      if (p.role !== "admin") return;
      setLogs(await fetchAudits({}));
    })();
  }, []);

  if (!me) return <div className="container mt-5">جارٍ التحميل...</div>;
  if (me.role !== "admin")
    return <div className="container mt-5 alert alert-warning">للمدير فقط</div>;

  return (
    <div className="container mt-4">
      <h3>سجلات التدقيق</h3>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>الوقت</th>
              <th>المستخدم</th>
              <th>العملية</th>
              <th>الكيان</th>
              <th>تفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
                <td>
                  {l.user?.name} ({l.user?.email})
                </td>
                <td>{l.action}</td>
                <td>
                  {l.entity}#{l.entityId}
                </td>
                <td>
                  <code style={{ whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(l.meta)}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAudits;
