import React from "react";
import "./SearchResults.css"; // تأكد أن هذا الملف موجود لتنسيق النتائج

const SearchResults = ({ results, isLoading, searchQuery }) => {
  if (isLoading) {
    return <p className="loading-text">جاري البحث عن "{searchQuery}"...</p>;
  }

  if (!results || results.length === 0) {
    return (
      <p className="no-results-text">لا توجد نتائج للبحث "{searchQuery}"</p>
    );
  }

  return (
    <div className="search-results">
      <h3 className="results-title">
        نتائج البحث عن: <span className="query-text">{searchQuery}</span>
      </h3>
      <ul className="results-list">
        {results.map((item, index) => (
          <li key={index} className="result-item">
            {/* العنوان أو الاسم */}
            <h4 className="result-title">{item.title || item.name}</h4>

            {/* نوع العنصر */}
            {item.type && <span className="result-type">[{item.type}]</span>}

            {/* تاريخ النشر */}
            {item.date && <span className="result-date">{item.date}</span>}

            {/* وصف أو ملخص */}
            {item.summary && <p className="result-summary">{item.summary}</p>}

            {/* رابط التفاصيل إن وجد */}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="result-link"
              >
                عرض التفاصيل
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
