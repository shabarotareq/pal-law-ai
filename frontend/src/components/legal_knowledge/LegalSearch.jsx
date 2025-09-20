import React, { useState } from "react";
import { useLegalKnowledge } from "../../contexts/LegalKnowledgeContext";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import "./LegalSearch.css";

const LegalSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [courtLevel, setCourtLevel] = useState("");
  const [searchType, setSearchType] = useState("all");

  const { searchLegalKnowledge, searchResults, isLoading, error } =
    useLegalKnowledge();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const filters = {
      category: selectedCategory !== "all" ? selectedCategory : null,
      dateRange:
        dateRange.start && dateRange.end
          ? { start: dateRange.start, end: dateRange.end }
          : null,
      courtLevel: courtLevel || null,
      type: searchType !== "all" ? searchType : null,
    };

    await searchLegalKnowledge(searchQuery, filters);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setDateRange({ start: "", end: "" });
    setCourtLevel("");
    setSearchType("all");
  };

  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "civil", label: "مدني" },
    { value: "criminal", label: "جنائي" },
    { value: "commercial", label: "تجاري" },
    { value: "administrative", label: "إداري" },
    { value: "labor", label: "عمل" },
    { value: "family", label: "أحوال شخصية" },
  ];

  const courtLevels = [
    { value: "", label: "جميع المحاكم" },
    { value: "supreme", label: "المحكمة العليا" },
    { value: "appeal", label: "استئناف" },
    { value: "first_instance", label: "ابتدائية" },
  ];

  return (
    <div className="legal-search">
      <div className="search-header">
        <h2>البحث في المنظومة القانونية</h2>
        <p>ابحث في القوانين، الأحكام القضائية، وإجراءات التقاضي</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اكتب كلمات البحث أو سؤال قانوني..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? "جاري البحث..." : "بحث"}
          </button>
        </div>

        <SearchFilters
          searchType={searchType}
          setSearchType={setSearchType}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          courtLevels={courtLevels}
          courtLevel={courtLevel}
          setCourtLevel={setCourtLevel}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleClearFilters={handleClearFilters}
        />
      </form>

      {error && (
        <div className="error-message">
          <p>خطأ: {error}</p>
        </div>
      )}

      {searchResults.length === 0 && !isLoading ? (
        <p className="no-results">لا توجد نتائج مطابقة للبحث</p>
      ) : (
        <SearchResults
          results={searchResults}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default LegalSearch;
