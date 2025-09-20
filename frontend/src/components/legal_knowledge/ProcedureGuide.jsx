import React, { useState, useEffect } from "react";
import { useLegalKnowledge } from "../../contexts/LegalKnowledgeContext";
import "./ProcedureGuide.css";

const ProcedureGuide = () => {
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { getProcedureById } = useLegalKnowledge();

  useEffect(() => {
    // بيانات تجريبية
    const mockProcedures = [
      {
        id: 1,
        title: "رفع دعوى مدنية",
        description: "خطوات رفع الدعوى المدنية أمام المحكمة",
        category: "مدني",
        steps: [
          "تحديد المحكمة المختصة نوعياً ومحلياً",
          "تحضير صحيفة الدعوى والمستندات المطلوبة",
          "دفع الرسوم القضائية",
          "تقديم الصحيفة إلى كتابة العدل",
        ],
        requiredDocuments: [
          "صورة البطاقة",
          "المستندات المؤيدة",
          "الوكالة إن وجدت",
        ],
        timeFrames: "30 يوم من تاريخ الحدث",
        courtLevel: "ابتدائية",
      },
      {
        id: 2,
        title: "استئناف الحكم",
        description: "إجراءات استئناف الأحكام",
        category: "جميع الفئات",
        steps: [
          "تقديم مذكرة الاستئناف خلال المدة القانونية",
          "دفع رسوم الاستئناف",
          "إرفاق صورة من الحكم المطلوب استئنافه",
        ],
        requiredDocuments: ["مذكرة الاستئناف", "صورة الحكم", "إيصال الدفع"],
        timeFrames: "30 يوم من تاريخ النطق بالحكم",
        courtLevel: "استئناف",
      },
    ];
    setProcedures(mockProcedures);
    setFilteredProcedures(mockProcedures);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredProcedures(procedures);
      return;
    }

    const filtered = procedures.filter(
      (procedure) =>
        procedure.title.toLowerCase().includes(term.toLowerCase()) ||
        procedure.description.toLowerCase().includes(term.toLowerCase()) ||
        procedure.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProcedures(filtered);
  };

  const handleSelectProcedure = async (procedureId) => {
    try {
      // في التطبيق الحقيقي: const procedure = await getProcedureById(procedureId);
      const procedure = procedures.find((p) => p.id === procedureId);
      setSelectedProcedure(procedure);
      setActiveStep(0);
    } catch (error) {
      console.error("Error fetching procedure:", error);
    }
  };

  const categories = [...new Set(procedures.map((p) => p.category))];

  return (
    <div className="procedure-guide">
      <div className="guide-header">
        <h2>دليل الإجراءات القانونية</h2>
        <p>دليل شامل لإجراءات التقاضي والإجراءات القانونية المختلفة</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث في الإجراءات..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="categories-filter">
          <button
            className={!searchTerm ? "active" : ""}
            onClick={() => handleSearch("")}
          >
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={searchTerm === category ? "active" : ""}
              onClick={() => handleSearch(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="guide-content">
        <div className="procedures-list">
          <h3>الإجراءات المتاحة ({filteredProcedures.length})</h3>
          {filteredProcedures.map((procedure) => (
            <div
              key={procedure.id}
              className={`procedure-item ${
                selectedProcedure?.id === procedure.id ? "selected" : ""
              }`}
              onClick={() => handleSelectProcedure(procedure.id)}
            >
              <h4>{procedure.title}</h4>
              <p>{procedure.description}</p>
              <div className="procedure-meta">
                <span className="category">{procedure.category}</span>
                <span className="steps-count">
                  {procedure.steps.length} خطوة
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="procedure-detail">
          {selectedProcedure ? (
            <>
              <div className="procedure-header">
                <h3>{selectedProcedure.title}</h3>
                <div className="meta-info">
                  <span className="category">{selectedProcedure.category}</span>
                  <span className="court-level">
                    {selectedProcedure.courtLevel}
                  </span>
                </div>
              </div>

              <div className="procedure-description">
                <p>{selectedProcedure.description}</p>
              </div>

              <div className="steps-section">
                <h4>خطوات الإجراء</h4>
                <div className="steps-container">
                  {selectedProcedure.steps.map((step, index) => (
                    <div
                      key={index}
                      className={`step ${index === activeStep ? "active" : ""}`}
                      onClick={() => setActiveStep(index)}
                    >
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="requirements-section">
                <h4>المستندات المطلوبة</h4>
                <ul>
                  {selectedProcedure.requiredDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="time-frame">
                <h4>الإطار الزمني</h4>
                <p>{selectedProcedure.timeFrames}</p>
              </div>

              <div className="procedure-actions">
                <button className="action-button">طباعة الدليل</button>
                <button className="action-button">حفظ كملف PDF</button>
                <button className="action-button">مشاركة</button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>اختر إجراءً من القائمة لعرض تفاصيله</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcedureGuide;
