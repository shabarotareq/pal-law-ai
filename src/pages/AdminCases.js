import { useEffect, useState } from "react";
import { fetchAdminCases } from "../services/adminService";
import { getProfile } from "../services/authService";
import { exportCasesToExcel, exportCasesToPDF } from "../utils/exporters";

const AdminCases = () => {
  const [me, setMe] = useState(null);
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    lawType: "",
    from: "",
    to: "",
  });
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const data = await fetchAdminCases(filters);
      setCases(data);
    } catch {
      setMsg("فشل جلب القضايا");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setMe(profile);
        if (profile.role !== "admin") {
          setMsg("هذه الصفحة للمدير فقط.");
          return;
        }
        await load();
      } catch {
        setMsg("تعذر التحميل");
      }
    })();
    {
      /*  eslint-disable-next-line */
    }
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const applyFilters = async (e) => {
    e.preventDefault();
    await load();
  };

  const exportRows = cases.map((c) => ({
    title: c.title,
    lawType: c.lawType,
    description: c.description,
    createdAt: c.createdAt,
    createdBy: c.createdBy?.name || "",
  }));

  if (msg && !me)
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">{msg}</div>
      </div>
    );
  if (!me) return <div className="container mt-5">جارٍ التحميل...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">قضايا النظام (أدمن)</h3>

      <form className="row g-2 mb-3" onSubmit={applyFilters}>
        <div className="col-md-3">
          <input
            className="form-control"
            name="q"
            placeholder="بحث نصي"
            value={filters.q}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            name="lawType"
            value={filters.lawType}
            onChange={handleChange}
          >
            <option value="">كل الأنواع</option>
            <option value="جنائي">جنائي</option>
            <option value="مدني">مدني</option>
            <option value="شرعي">شرعي</option>
            <option value="عمل">عمل</option>
            <option value="جرائم إلكترونية">جرائم إلكترونية</option>
            <option value="ضرائب">ضرائب</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="from"
            value={filters.from}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="to"
            value={filters.to}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-primary" type="submit">
            تطبيق
          </button>
        </div>
      </form>

      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-outline-success"
          onClick={() => exportCasesToExcel(exportRows, "admin_cases.xlsx")}
        >
          تصدير Excel
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => exportCasesToPDF(exportRows, "admin_cases.pdf")}
        >
          تصدير PDF
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>العنوان</th>
              <th>النوع</th>
              <th>الوصف</th>
              <th>المنشئ</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>
                  <span className="badge bg-info">{c.lawType}</span>
                </td>
                <td style={{ maxWidth: 380 }}>{c.description}</td>
                <td>{c.createdBy?.name}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCases;
