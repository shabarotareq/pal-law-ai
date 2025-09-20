import React, { useState, useEffect } from "react";
import { useLegalKnowledge } from "../../contexts/LegalKnowledgeContext";
import "./JudgmentViewer.css";

const JudgmentViewer = () => {
  const [judgments, setJudgments] = useState([]);
  const [selectedJudgment, setSelectedJudgment] = useState(null);
  const [filteredJudgments, setFilteredJudgments] = useState([]);
  const [filters, setFilters] = useState({
    courtLevel: "",
    category: "",
    year: "",
    searchTerm: "",
  });

  const { getJudgmentById } = useLegalKnowledge();

  useEffect(() => {
    // بيانات تجريبية - في التطبيق الحقيقي سيتم جلبها من API
    const mockJudgments = [
      {
        id: 1,
        caseNumber: "١٢٣٤/٤٥",
        courtName: "محكمة الرياض",
        judgmentDate: "2023-10-15",
        summary: "حكم بعدم الاختصاص النوعي",
        fullText: "حكمت المحكمة بعدم اختصاصها النوعي في الدعوى المقدمة منها...",
        category: "الاختصاص القضائي",
        courtLevel: "استئناف",
      },
      {
        id: 2,
        caseNumber: "٥٦٧٨/٩٠",
        courtName: "محكمة جدة",
        judgmentDate: "2023-09-20",
        summary: "حكم بالتعويض عن الضرر المادي",
        fullText: "بناء على الأدلة المقدمة، حكمت المحكمة بالتعويض...",
        category: "مدني",
        courtLevel: "ابتدائية",
      },
    ];
    setJudgments(mockJudgments);
    setFilteredJudgments(mockJudgments);
  }, []);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = judgments;

    if (currentFilters.courtLevel) {
      filtered = filtered.filter(
        (j) => j.courtLevel === currentFilters.courtLevel
      );
    }

    if (currentFilters.category) {
      filtered = filtered.filter((j) => j.category === currentFilters.category);
    }

    if (currentFilters.year) {
      filtered = filtered.filter(
        (j) =>
          new Date(j.judgmentDate).getFullYear().toString() ===
          currentFilters.year
      );
    }

    if (currentFilters.searchTerm) {
      const term = currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.caseNumber.toLowerCase().includes(term) ||
          j.courtName.toLowerCase().includes(term) ||
          j.summary.toLowerCase().includes(term) ||
          j.fullText.toLowerCase().includes(term)
      );
    }

    setFilteredJudgments(filtered);
  };

  const handleSelectJudgment = async (judgmentId) => {
    try {
      // في التطبيق الحقيقي: const judgment = await getJudgmentById(judgmentId);
      const judgment = judgments.find((j) => j.id === judgmentId);
      setSelectedJudgment(judgment);
    } catch (error) {
      console.error("Error fetching judgment:", error);
    }
  };

  const courtLevels = ["ابتدائية", "استئناف", "عليا"];
  const categories = ["مدني", "جنائي", "تجاري", "إداري", "عمل", "أحوال شخصية"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="judgment-viewer">
      <div className="viewer-header">
        <h2>عارض الأحكام القضائية</h2>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>مستوى المحكمة:</label>
          <select
            value={filters.courtLevel}
            onChange={(e) => handleFilterChange("courtLevel", e.target.value)}
          >
            <option value="">الكل</option>
            {courtLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>الفئة:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">الكل</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>السنة:</label>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
          >
            <option value="">الكل</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <input
            type="text"
            placeholder="ابحث في الأحكام..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="viewer-content">
        <div className="judgments-list">
          <h3>الأحكام ({filteredJudgments.length})</h3>
          {filteredJudgments.map((judgment) => (
            <div
              key={judgment.id}
              className={`judgment-item ${
                selectedJudgment?.id === judgment.id ? "selected" : ""
              }`}
              onClick={() => handleSelectJudgment(judgment.id)}
            >
              <div className="case-number">{judgment.caseNumber}</div>
              <div className="court-name">{judgment.courtName}</div>
              <div className="judgment-date">
                {new Date(judgment.judgmentDate).toLocaleDateString("ar-SA")}
              </div>
              <div className="summary">{judgment.summary}</div>
              <div className="category-badge">{judgment.category}</div>
            </div>
          ))}
        </div>

        <div className="judgment-detail">
          {selectedJudgment ? (
            <>
              <div className="judgment-header">
                <h3>الحكم رقم {selectedJudgment.caseNumber}</h3>
                <div className="meta-info">
                  <span>المحكمة: {selectedJudgment.courtName}</span>
                  <span>
                    التاريخ:{" "}
                    {new Date(selectedJudgment.judgmentDate).toLocaleDateString(
                      "ar-SA"
                    )}
                  </span>
                  <span>الفئة: {selectedJudgment.category}</span>
                </div>
              </div>

              <div className="judgment-summary">
                <h4>ملخص الحكم</h4>
                <p>{selectedJudgment.summary}</p>
              </div>

              <div className="judgment-full-text">
                <h4>نص الحكم الكامل</h4>
                <div className="text-content">{selectedJudgment.fullText}</div>
              </div>

              <div className="judgment-actions">
                <button className="action-button">تحميل PDF</button>
                <button className="action-button">نسخ النص</button>
                <button className="action-button">إضافة إلى المفضلة</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>اختر حكماً من القائمة لعرض تفاصيله</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JudgmentViewer;
