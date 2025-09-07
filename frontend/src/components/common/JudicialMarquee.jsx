import React, { useEffect, useState } from "react";
import axios from "axios";

const JudicialMarquee = ({ lang = "ar" }) => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = "c0939a5a0f904e5281893f069d598cfc";
        const query =
          lang === "ar"
            ? 'فلسطين OR "تعديل قانون" OR "مرسوم رئاسي" OR "تشريعات" OR "إجراءات حكومية"'
            : 'Palestine OR "law amendment" OR "Presidential decree" OR "legislation" OR "government procedures"';

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`;

        const response = await axios.get(url);
        setNewsItems(response.data.articles || []);
      } catch (error) {
        console.error("Failed to fetch Palestinian judicial news:", error);

        // بيانات ثابتة fallback
        const staticData = [
          {
            type: "تعديل قانون فلسطيني",
            description: "تعديل المادة 5 من قانون السلطة القضائية.",
          },
          {
            type: "مرسوم رئاسي",
            description: "مرسوم رقم 7 لسنة 2025 بشأن تنظيم القضاء العسكري.",
          },
          {
            type: "تعليمات وإجراءات",
            description: "تعليمات جديدة تخص الإجراءات الإدارية والقانونية.",
          },
        ];
        setNewsItems(staticData);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lang]);

  // اتجاه النص
  const direction = lang === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="w-full overflow-hidden bg-blue-700 text-white py-2 px-4 flex items-center"
      style={{ direction }}
    >
      {/* العنوان الثابت */}
      <span className="font-bold mx-4 flex-shrink-0">
        {lang === "ar"
          ? "آخر المستجدات القضائية الفلسطينية"
          : "Latest Palestinian Judicial News"}
      </span>

      {/* الأخبار المتحركة */}
      <div className="whitespace-nowrap animate-marquee flex gap-12 flex-1">
        {newsItems.length > 0 ? (
          newsItems.map((item, idx) => (
            <span key={idx} className="mx-4 font-semibold">
              {lang === "ar"
                ? `${item.title || item.type}: ${item.description || ""}`
                : `${item.title || item.type}: ${item.description || ""}`}
            </span>
          ))
        ) : (
          <span className="font-semibold">
            {lang === "ar"
              ? "جاري تحميل آخر الأخبار القضائية..."
              : "Loading latest judicial news..."}
          </span>
        )}
      </div>

      <style>{`
        @keyframes marquee-ar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes marquee-en {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: ${
            lang === "ar" ? "marquee-ar" : "marquee-en"
          } 265s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default JudicialMarquee;

