import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

const NewsComponent = ({
  newsData,
  loading,
  error,
  setNewsData,
  setLoading,
  setError,
  lang = "ar",
}) => {
  const fetchPalestinianNews = async () => {
    try {
      setLoading(true);
      setError(null);

      // استخدام API بديل أو mock data للاختبار
      const API_URL =
        "https://newsapi.org/v2/everything?q=palestinian+judicial&apiKey=YOUR_API_KEY";

      // بديل: استخدام mock data للاختبار
      const mockNews = [
        {
          id: 1,
          title:
            lang === "ar"
              ? "تطورات القضاء الفلسطيني"
              : "Palestinian Judicial Developments",
          content:
            lang === "ar"
              ? "أحدث التطورات في النظام القضائي الفلسطيني والمحاكم."
              : "Latest developments in the Palestinian judicial system and courts.",
          date: "2024-01-15",
          source: "القضاء الفلسطيني",
        },
        {
          id: 2,
          title: lang === "ar" ? "إصلاحات قانونية" : "Legal Reforms",
          content:
            lang === "ar"
              ? "جهود إصلاحية في النظام القانوني الفلسطيني."
              : "Reform efforts in the Palestinian legal system.",
          date: "2024-01-14",
          source: "وزارة العدل",
        },
      ];

      // محاكاة fetch للاختبار
      setTimeout(() => {
        setNewsData(mockNews);
        setLoading(false);
      }, 1000);

      /*
      // الكود الحقيقي للـ API:
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`خطأ في الخادم: ${response.status}`);
      }

      const data = await response.json();
      setNewsData(data.articles || []);
      */
    } catch (err) {
      console.error("فشل في جلب الأخبار:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!newsData && !loading) {
      fetchPalestinianNews();
    }
  }, [newsData, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size="large" />
        <span className="mr-2 text-gray-600">
          {lang === "ar" ? "جاري تحميل الأخبار..." : "Loading news..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 font-semibold mb-2">
          {lang === "ar" ? "خطأ في التحميل" : "Loading Error"}
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchPalestinianNews}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          {lang === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="news-container bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {lang === "ar" ? "أخبار القضاء الفلسطيني" : "Palestinian Judicial News"}
      </h2>

      {newsData && newsData.length > 0 ? (
        <div className="space-y-4">
          {newsData.map((newsItem) => (
            <article
              key={newsItem.id || newsItem.url}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                {newsItem.title}
              </h3>

              <p className="text-gray-600 mb-3 leading-relaxed">
                {newsItem.content || newsItem.description}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {newsItem.source && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {typeof newsItem.source === "object"
                        ? newsItem.source.name
                        : newsItem.source}
                    </span>
                  )}
                </span>

                <span>
                  {newsItem.date &&
                    new Date(newsItem.date).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          {lang === "ar"
            ? "لا توجد أخبار متاحة حالياً"
            : "No news available at the moment"}
        </div>
      )}
    </div>
  );
};

export default NewsComponent;
