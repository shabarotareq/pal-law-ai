import React, { useState, useEffect } from "react";
import { useLegalKnowledge } from "../../contexts/LegalKnowledgeContext";
import "./LawBrowser.css";

const LawBrowser = () => {
  const [laws, setLaws] = useState([]);
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLaws, setFilteredLaws] = useState([]);

  const { getLawById } = useLegalKnowledge();

  useEffect(() => {
    // في التطبيق الحقيقي، سيتم جلب البيانات من API
    const mockLaws = [
      {
        id: 1,
        title: "نظام المرافعات الشرعية",
        category: "الإجراءات",
        articles: [
          {
            number: 1,
            content: "المادة 1: يجب تقديم الدعوى إلى المحكمة المختصة...",
          },
          {
            number: 2,
            content: "المادة 2: يشترط في الدعوى أن تكون مرفقة بالمستندات...",
          },
        ],
      },
      {
        id: 2,
        title: "نظام العقوبات",
        category: "جنائي",
        articles: [
          {
            number: 1,
            content: "المادة 1: العقوبة تتناسب مع جسامة الجريمة...",
          },
        ],
      },
    ];
    setLaws(mockLaws);
    setFilteredLaws(mockLaws);
  }, []);

  const handleLawSelect = async (lawId) => {
    setIsLoading(true);
    try {
      // في التطبيق الحقيقي: const law = await getLawById(lawId);
      const law = laws.find((l) => l.id === lawId);
      setSelectedLaw(law);
      setSelectedArticle(null);
    } catch (error) {
      console.error("Error fetching law:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredLaws(laws);
      return;
    }

    const filtered = laws.filter(
      (law) =>
        law.title.toLowerCase().includes(term.toLowerCase()) ||
        law.articles.some((article) =>
          article.content.toLowerCase().includes(term.toLowerCase())
        )
    );
    setFilteredLaws(filtered);
  };

  return (
    <div className="law-browser">
      <div className="browser-header">
        <h2>متصفح القوانين</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث في القوانين..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="browser-content">
        <div className="laws-list">
          <h3>القوانين المتاحة</h3>
          {filteredLaws.map((law) => (
            <div
              key={law.id}
              className={`law-item ${
                selectedLaw?.id === law.id ? "selected" : ""
              }`}
              onClick={() => handleLawSelect(law.id)}
            >
              <h4>{law.title}</h4>
              <span className="law-category">{law.category}</span>
              <span className="articles-count">{law.articles.length} مادة</span>
            </div>
          ))}
        </div>

        <div className="law-details">
          {isLoading ? (
            <div className="loading">جاري التحميل...</div>
          ) : selectedLaw ? (
            <>
              <div className="law-header">
                <h3>{selectedLaw.title}</h3>
                <span className="category-badge">{selectedLaw.category}</span>
              </div>

              <div className="articles-list">
                {selectedLaw.articles.map((article) => (
                  <div
                    key={article.number}
                    className={`article-item ${
                      selectedArticle?.number === article.number
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="article-number">
                      المادة {article.number}
                    </div>
                    <div className="article-content">{article.content}</div>
                  </div>
                ))}
              </div>

              {selectedArticle && (
                <div className="article-detail">
                  <h4>المادة {selectedArticle.number}</h4>
                  <p>{selectedArticle.content}</p>
                  <div className="article-actions">
                    <button className="action-button">نسخ النص</button>
                    <button className="action-button">إضافة إلى المفضلة</button>
                    <button className="action-button">اقتراح تعديل</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>اختر قانوناً من القائمة لعرض محتواه</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawBrowser;
