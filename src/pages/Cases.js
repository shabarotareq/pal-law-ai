import { useState, useEffect } from "react";
import { createCase, getCases } from "../services/caseService";
import { exportCasesToExcel, exportCasesToPDF } from "../utils/exporters";

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    lawType: "جنائي",
  });
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    q: "",
    lawType: "",
    from: "",
    to: "",
  });

  const load = async () => {
    try {
      const data = await getCases(filters);
      setCases(data);
    } catch {
      setError("فشل في جلب القضايا");
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFiltersChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCase = await createCase(form);
      setCases([...cases, newCase]);
      setForm({ title: "", description: "", lawType: "جنائي" });
    } catch {
      setError("فشل في إضافة القضية");
    }
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    await load();
  };

  const exportRows = cases.map((c) => ({
    title: c.title,
    lawType: c.lawType,
    description: c.description,
    createdAt: c.createdAt,
  }));

  return (
    <div className="container mt-5">
      <h2>إدارة القضايا</h2>
      {error && <p className="text-danger">{error}</p>}

      {/* إضافة قضية */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-2"
          name="title"
          placeholder="عنوان القضية"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          className="form-control mb-2"
          name="description"
          placeholder="وصف القضية"
          value={form.description}
          onChange={handleChange}
        />
        <select
          className="form-control mb-2"
          name="lawType"
          value={form.lawType}
          onChange={handleChange}
        >
          <option value="جنائي">جنائي</option>
          <option value="مدني">مدني</option>
          <option value="شرعي">شرعي</option>
          <option value="عمل">عمل</option>
          <option value="جرائم إلكترونية">جرائم إلكترونية</option>
          <option value="ضرائب">ضرائب</option>
        </select>
        <button type="submit" className="btn btn-primary">
          إضافة قضية
        </button>
      </form>

      {/* فلاتر */}
      <form className="row g-2 mb-3" onSubmit={applyFilters}>
        <div className="col-md-3">
          <input
            className="form-control"
            name="q"
            placeholder="بحث نصي"
            value={filters.q}
            onChange={handleFiltersChange}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            name="lawType"
            value={filters.lawType}
            onChange={handleFiltersChange}
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
            onChange={handleFiltersChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="to"
            value={filters.to}
            onChange={handleFiltersChange}
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
          onClick={() => exportCasesToExcel(exportRows, "my_cases.xlsx")}
        >
          تصدير Excel
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => exportCasesToPDF(exportRows, "my_cases.pdf")}
        >
          تصدير PDF
        </button>
      </div>

      {/* جدول القضايا */}

      <h3>قضاياي</h3>
      <ul className="list-group">
        {cases.length > 0 ? (
          cases.map((c) => (
            <li key={c._id} className="list-group-item">
              <h5>
                {c.title} <span className="badge bg-info">{c.lawType}</span>
              </h5>
              <p className="mb-1">{c.description}</p>
              <small className="text-muted">
                أُنشئت: {new Date(c.createdAt).toLocaleString()}
              </small>
            </li>
          ))
        ) : (
          <p>لا توجد قضايا بعد.</p>
        )}
      </ul>
      <li key={c._id} className="list-group-item">
        <h5>
          {c.title} <span className="badge bg-info">{c.lawType}</span>
          {c.deletedAt && <span className="badge bg-danger ms-2">محذوفة</span>}
        </h5>
        <p className="mb-1">{c.description}</p>
        <small className="text-muted">
          أُنشئت: {new Date(c.createdAt).toLocaleString()}
        </small>
        <div className="mt-2 d-flex gap-2">
          {!c.deletedAt ? (
            <button
              className="btn btn-warning btn-sm"
              onClick={async () => {
                await softDeleteCase(c._id);
                setCases((prev) =>
                  prev.map((x) =>
                    x._id === c._id
                      ? { ...x, deletedAt: new Date().toISOString() }
                      : x
                  )
                );
              }}
            >
              حذف (Soft)
            </button>
          ) : (
            <button
              className="btn btn-success btn-sm"
              onClick={async () => {
                await restoreCase(c._id);
                setCases((prev) =>
                  prev.map((x) =>
                    x._id === c._id ? { ...x, deletedAt: null } : x
                  )
                );
              }}
            >
              استعادة
            </button>
          )}
        </div>
      </li>
    </div>
  );
};

export default Cases;
