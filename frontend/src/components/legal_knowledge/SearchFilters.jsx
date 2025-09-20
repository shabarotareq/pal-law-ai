import React from "react";
import "./SearchFilters.css"; // تأكد أن الملف موجود لتنسيق الفلاتر

const SearchFilters = ({
  searchType,
  setSearchType,
  categories,
  selectedCategory,
  setSelectedCategory,
  courtLevels,
  courtLevel,
  setCourtLevel,
  dateRange,
  setDateRange,
  handleClearFilters,
}) => {
  return (
    <div className="filters-section">
      {/* نوع البحث */}
      <div className="filter-group">
        <label>نوع البحث:</label>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="filter-select"
        >
          {[
            { value: "all", label: "جميع المصادر" },
            { value: "laws", label: "القوانين فقط" },
            { value: "judgments", label: "الأحكام فقط" },
            { value: "procedures", label: "الإجراءات فقط" },
          ].map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* الفئة */}
      <div className="filter-group">
        <label>الفئة:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* مستوى المحكمة */}
      <div className="filter-group">
        <label>مستوى المحكمة:</label>
        <select
          value={courtLevel}
          onChange={(e) => setCourtLevel(e.target.value)}
          className="filter-select"
        >
          {courtLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* نطاق التاريخ */}
      <div className="filter-group">
        <label>التاريخ من:</label>
        <input
          type="date"
          value={dateRange.start || ""}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, start: e.target.value }))
          }
          className="date-input"
        />
      </div>

      <div className="filter-group">
        <label>إلى:</label>
        <input
          type="date"
          value={dateRange.end || ""}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, end: e.target.value }))
          }
          className="date-input"
        />
      </div>

      {/* زر مسح الفلاتر */}
      <button
        type="button"
        onClick={handleClearFilters}
        className="clear-filters-button"
      >
        مسح الفلاتر
      </button>
    </div>
  );
};

export default SearchFilters;
