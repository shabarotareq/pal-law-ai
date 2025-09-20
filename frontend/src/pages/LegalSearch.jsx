import "./LegalSearch.module.css";

import React, { useState } from "react";
import { useLegalKnowledge } from "../contexts/LegalKnowledgeContext";
import SearchResults from "../components/search/SearchResults";

const LegalSearch = ({ lang = "ar" }) => {
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
      dateRange: dateRange.start && dateRange.end ? dateRange : null,
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

  return (
    <div className="legal-search max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">
        {lang === "ar" ? "البحث المتقدم" : "Advanced Search"}
      </h2>
      <p className="mb-4 text-gray-600">
        {lang === "ar"
          ? "ابحث في القوانين، الأحكام، والإجراءات."
          : "Search laws, judgments, and procedures."}
      </p>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "ar" ? "اكتب كلمات البحث..." : "Enter search terms..."
            }
            className="flex-grow border rounded-lg p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-lg"
            disabled={isLoading}
          >
            {isLoading
              ? lang === "ar"
                ? "جاري البحث..."
                : "Searching..."
              : lang === "ar"
              ? "بحث"
              : "Search"}
          </button>
        </div>

        {/* فلاتر إضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="all">
              {lang === "ar" ? "جميع المصادر" : "All Sources"}
            </option>
            <option value="laws">{lang === "ar" ? "القوانين" : "Laws"}</option>
            <option value="judgments">
              {lang === "ar" ? "الأحكام" : "Judgments"}
            </option>
            <option value="procedures">
              {lang === "ar" ? "الإجراءات" : "Procedures"}
            </option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="all">
              {lang === "ar" ? "جميع الفئات" : "All Categories"}
            </option>
            <option value="civil">{lang === "ar" ? "مدني" : "Civil"}</option>
            <option value="criminal">
              {lang === "ar" ? "جنائي" : "Criminal"}
            </option>
            <option value="commercial">
              {lang === "ar" ? "تجاري" : "Commercial"}
            </option>
            <option value="administrative">
              {lang === "ar" ? "إداري" : "Administrative"}
            </option>
            <option value="labor">{lang === "ar" ? "عمل" : "Labor"}</option>
            <option value="family">
              {lang === "ar" ? "أحوال شخصية" : "Family"}
            </option>
          </select>

          <select
            value={courtLevel}
            onChange={(e) => setCourtLevel(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">
              {lang === "ar" ? "جميع المحاكم" : "All Courts"}
            </option>
            <option value="supreme">
              {lang === "ar" ? "المحكمة العليا" : "Supreme Court"}
            </option>
            <option value="appeal">
              {lang === "ar" ? "الاستئناف" : "Appeal"}
            </option>
            <option value="first_instance">
              {lang === "ar" ? "ابتدائية" : "First Instance"}
            </option>
          </select>

          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border p-2 rounded-lg flex-grow"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border p-2 rounded-lg flex-grow"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-red-600 hover:underline"
        >
          {lang === "ar" ? "مسح الفلاتر" : "Clear Filters"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 mt-4">
          {lang === "ar" ? `خطأ: ${error}` : `Error: ${error}`}
        </p>
      )}

      <div className="mt-6">
        <SearchResults
          results={searchResults}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default LegalSearch;
