import React from "react";
import SourceBadge from "../ui/SourceBadge";

const SearchResults = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg h-24"></div>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        لا توجد نتائج للعرض. جرب تعديل مصطلحات البحث أو تفعيل البحث عبر
        الإنترنت.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow border">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-blue-800">
              {result.title}
            </h3>
            <SourceBadge
              sourceType={result.sourceType}
              isOfficial={result.isOfficial}
              credibility={result.credibility}
            />
          </div>

          <p className="text-gray-700 mb-3">
            {result.description || result.content.substring(0, 200)}...
          </p>

          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              عرض المصدر الأصلي
            </a>
          )}

          <div className="mt-2 text-xs text-gray-500">
            {result.date &&
              `تاريخ النشر: ${new Date(result.date).toLocaleDateString(
                "ar-EG"
              )}`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
