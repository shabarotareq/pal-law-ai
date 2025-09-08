import React, { useState, useEffect, useCallback } from "react";
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
  // States محلية كبديل إذا لم يتم تمرير الدوال
  const [localNewsData, setLocalNewsData] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // استخدام الدوال الممررة أو المحلية
  const actualSetNewsData = setNewsData || setLocalNewsData;
  const actualSetLoading = setLoading || setLocalLoading;
  const actualSetError = setError || setLocalError;
  const actualNewsData = newsData || localNewsData;
  const actualLoading = loading !== undefined ? loading : localLoading;
  const actualError = error !== undefined ? error : localError;

  const fetchPalestinianNews = useCallback(async () => {
    try {
      // التحقق من أن الدالة موجودة قبل استدعائها
      if (actualSetLoading && typeof actualSetLoading === "function") {
        actualSetLoading(true);
      }
      if (actualSetError && typeof actualSetError === "function") {
        actualSetError(null);
      }

      // استخدام mock data للاختبار (أكثر أماناً من API الخارجي)
      const mockNews = [
        {
          id: 1,
          title:
            lang === "ar"
              ? "تطورات القضاء الفلسطيني"
              : "Palestinian Judicial Developments",
          content:
            lang === "ar"
              ? "أحدث التطورات في النظام القضائي الفلسطيني والمحاكم. اجتمع القضاة اليوم لمناقشة مستجدات النظام القضائي."
              : "Latest developments in the Palestinian judicial system and courts. Judges met today to discuss judicial system updates.",
          date: new Date().toISOString().split("T")[0],
          source: "المجلس القضائي الفلسطيني",
          image: "/api/placeholder/300/200",
          url: "#",
          category: "judicial",
        },
        {
          id: 2,
          title: lang === "ar" ? "إصلاحات قانونية" : "Legal Reforms",
          content:
            lang === "ar"
              ? "جهود إصلاحية في النظام القانوني الفلسطيني تشمل تحديث القوانين وتحسين إجراءات المحاكم."
              : "Reform efforts in the Palestinian legal system including law updates and court procedures improvement.",
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          source: "وزارة العدل",
          image: "/api/placeholder/300/200",
          url: "#",
          category: "legal",
        },
        {
          id: 3,
          title: lang === "ar" ? "ورشة عمل للقضاة" : "Judges Workshop",
          content:
            lang === "ar"
              ? "ورشة عمل تدريبية للقضاة الجدد في رام الله لتعزيز المهارات القضائية."
              : "Training workshop for new judges in Ramallah to enhance judicial skills.",
          date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
          source: "المعهد القضائي",
          image: "/api/placeholder/300/200",
          url: "#",
          category: "training",
        },
      ];

      // محاكاة fetch للاختبار مع تحسين الأداء
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (actualSetNewsData && typeof actualSetNewsData === "function") {
        actualSetNewsData(mockNews);
      }
    } catch (err) {
      console.error("فشل في جلب الأخبار:", err);

      if (actualSetError && typeof actualSetError === "function") {
        actualSetError(
          lang === "ar"
            ? "فشل في تحميل الأخبار. يرجى المحاولة مرة أخرى."
            : "Failed to load news. Please try again."
        );
      }
    } finally {
      if (actualSetLoading && typeof actualSetLoading === "function") {
        actualSetLoading(false);
      }
    }
  }, [lang, actualSetNewsData, actualSetLoading, actualSetError]);

  useEffect(() => {
    // جلب الأخبار فقط إذا لم تكن موجودة وليس في حالة تحميل
    if (!actualNewsData && !actualLoading) {
      fetchPalestinianNews();
    }
  }, [actualNewsData, actualLoading, fetchPalestinianNews]);

  const handleRetry = () => {
    if (actualSetError && typeof actualSetError === "function") {
      actualSetError(null);
    }
    fetchPalestinianNews();
  };

  if (actualLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-8 min-h-[200px]">
        <LoadingSpinner size="large" />
        <span className="mt-3 text-gray-600 text-sm">
          {lang === "ar" ? "جاري تحميل الأخبار..." : "Loading news..."}
        </span>
      </div>
    );
  }

  if (actualError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mx-4 my-6">
        <div className="text-red-600 font-semibold mb-3 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {lang === "ar" ? "خطأ في التحميل" : "Loading Error"}
        </div>
        <p className="text-red-500 text-sm mb-4">{actualError}</p>
        <button
          onClick={handleRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          {lang === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="news-container bg-white rounded-xl shadow-lg p-6 mx-4 my-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          {lang === "ar"
            ? "أخبار القضاء الفلسطيني"
            : "Palestinian Judicial News"}
        </h2>
        <p className="text-gray-600 text-sm">
          {lang === "ar"
            ? "آخر المستجدات والأخبار في النظام القضائي الفلسطيني"
            : "Latest updates and news in the Palestinian judicial system"}
        </p>
      </div>

      {actualNewsData && actualNewsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actualNewsData.map((newsItem) => (
            <article
              key={newsItem.id}
              className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200"
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="p-5">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {newsItem.category || "عام"}
                  </span>
                  <span className="text-gray-500 text-sm mx-3">•</span>
                  <span className="text-gray-500 text-sm">
                    {newsItem.date &&
                      new Date(newsItem.date).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {newsItem.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {newsItem.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {newsItem.source}
                  </span>

                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    {lang === "ar" ? "قراءة المزيد" : "Read more"} →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-gray-600 text-lg mb-2">
            {lang === "ar"
              ? "لا توجد أخبار متاحة حالياً"
              : "No news available at the moment"}
          </h3>
          <p className="text-gray-500 text-sm">
            {lang === "ar"
              ? "سيتم تحديث الأخبار قريباً"
              : "News will be updated soon"}
          </p>
        </div>
      )}

      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
          {lang === "ar" ? "تحديث الأخبار" : "Refresh News"}
        </button>
      </div>
    </div>
  );
};

export default NewsComponent;
