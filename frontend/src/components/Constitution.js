import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import "../../pages/BookFlip.module.css"; // ملف CSS مخصص لتصميم الكتاب

// تقسيم النص إلى صفحات صغيرة
const splitIntoPages = (text, maxCharsPerPage = 1200) => {
  const paragraphs = text.split(/\n\n+/);
  const pages = [];
  let currentPage = "";

  paragraphs.forEach((para) => {
    if ((currentPage + "\n\n" + para).length > maxCharsPerPage) {
      pages.push(currentPage);
      currentPage = para;
    } else {
      currentPage += (currentPage ? "\n\n" : "") + para;
    }
  });

  if (currentPage) pages.push(currentPage);
  return pages;
};

// تنسيق النصوص داخل الصفحة
const formatPage = (text) => {
  return text.split("\n").map((line, idx) => {
    if (/^📌 الباب|Chapter/.test(line.trim())) {
      return (
        <h1 key={idx} className="page-title">
          {line}
        </h1>
      );
    } else if (/^مادة|Article/.test(line.trim())) {
      return (
        <h2 key={idx} className="page-subtitle">
          {line}
        </h2>
      );
    } else {
      return (
        <p key={idx} className="page-text">
          {line}
        </p>
      );
    }
  });
};

const ConstitutionFlipBook = () => {
  const bookRef = useRef();
  const [lang, setLang] = useState("ar"); // اللغة الافتراضية
  const [texts, setTexts] = useState({ ar: "", en: "" }); // نصوص من DB

  // جلب النصوص من API عند تحميل المكون أو تغيير اللغة
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const res = await fetch("/api/constitution"); // API Route
        const data = await res.json();
        setTexts({ ar: data.ar, en: data.en });
      } catch (err) {
        console.error("Failed to fetch constitution texts:", err);
      }
    };
    fetchTexts();
  }, []);

  const pages = splitIntoPages(lang === "ar" ? texts.ar : texts.en);

  return (
    <div className="flipbook-container">
      {/* أزرار التحكم */}
      <div className="controls">
        <button onClick={() => setLang("ar")}>🇵🇸 عربي</button>
        <button onClick={() => setLang("en")}>🇬🇧 English</button>
      </div>

      {/* كتاب الدستور */}
      <HTMLFlipBook
        width={600}
        height={800}
        size="stretch"
        minWidth={300}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1333}
        maxShadowOpacity={0} // 🔹 إلغاء الشفافية والظلال
        showCover={true}
        mobileScrollSupport={true}
        usePortrait={true}
        drawShadow={false} // 🔹 تعطيل الظلال المتحركة
        ref={bookRef}
        className="custom-flipbook"
      >
        {pages.map((page, index) => (
          <div key={index} className="page">
            <div className="page-content">{formatPage(page)}</div>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default ConstitutionFlipBook;
