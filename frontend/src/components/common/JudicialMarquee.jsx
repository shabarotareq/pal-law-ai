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
            ? '"تعديل قانون فلسطيني" OR "مرسوم رئاسي" OR "تعليمات" OR "إجراءات حكومية"'
            : '"Palestinian law amendment" OR "Presidential decree" OR "Instructions" OR "Government procedures"';

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`;

        const response = await axios.get(url);
        setNewsItems(response.data.articles || []);
      } catch (error) {
        console.error("Failed to fetch Palestinian judicial news:", error);

        const staticData = [
          {
            type: "تعديل قانون فلسطيني",
            description: "قانون رقم 12 لسنة 2025: تعديل المادة 5 بشأن...",
          },
          {
            type: "مرسوم رئاسي",
            description: "مرسوم رئاسي رقم 7 لسنة 2025 بشأن تنظيم...",
          },
          {
            type: "تعليمات وإجراءات قانونية",
            description: "تعليمات تنفيذية بشأن الإجراءات القضائية الجديدة.",
          },
        ];
        setNewsItems(staticData);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const direction = lang === "ar" ? "ltr" : "rtl";

  return (
    <div
      className="w-full overflow-hidden bg-blue-700 text-white py-2 px-4"
      style={{ direction }}
    >
      <div className="whitespace-nowrap animate-marquee flex gap-12">
        <span className="font-bold mx-4">
          {lang === "ar"
            ? "آخر التعديلات القضائية الفلسطينية"
            : "Latest Palestinian Judicial Updates"}
        </span>
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
              ? "جاري تحميل آخر التعديلات القضائية الفلسطينية..."
              : "Loading latest Palestinian judicial updates..."}
          </span>
        )}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(${lang === "ar" ? "-100%" : "100%"}); }
          100% { transform: translateX(${lang === "ar" ? "100%" : "-100%"}); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 160s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default JudicialMarquee;
