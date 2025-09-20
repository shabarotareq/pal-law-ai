import React from "react";
import "./SearchResults.css";

const SearchResults = ({ results, isLoading, searchQuery, onResultClick }) => {
  if (isLoading) {
    return (
      <div className="search-results-loading">
        <div className="loading-spinner"></div>
        <p>جاري البحث عن "{searchQuery}"...</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="search-results-empty">
        <div className="empty-icon">🔍</div>
        <h3>لا توجد نتائج</h3>
        <p>لم نتمكن من العثور على نتائج تطابق "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>نتائج البحث ({results.length})</h3>
        <p>عرض النتائج للبحث عن: "{searchQuery}"</p>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <div
            key={index}
            className="result-item"
            onClick={() => onResultClick && onResultClick(result)}
          >
            <div className="result-type-badge">{result.type}</div>
            <div className="result-content">
              <h4 className="result-title">{result.title}</h4>
              <p className="result-description">{result.description}</p>
              <div className="result-meta">
                {result.date && (
                  <span className="result-date">{result.date}</span>
                )}
                {result.category && (
                  <span className="result-category">{result.category}</span>
                )}
                {result.confidence && (
                  <span className="result-confidence">
                    التشابه: {result.confidence}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
