"use client";

import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

// نصوص الدستور
const arabicText = `2003
استناداً إلى المادة (111) من القانون الأساسي ...`;

// يمكنك إضافة نصوص إنجليزية هنا
const englishText = `Amended Basic Law of 2003
Preamble
2003
...`;

// تقسيم النصوص إلى صفحات
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
const formatPage = (text) =>
  text.split("\n").map((line, idx) => {
    if (/^مادة|Article/.test(line.trim())) {
      return (
        <h2 key={idx} className="text-xl font-bold my-3">
          {line}
        </h2>
      );
    } else if (line.trim() === "") {
      return <br key={idx} />;
    } else {
      return (
        <p key={idx} className="text-base leading-relaxed text-justify my-2">
          {line}
        </p>
      );
    }
  });

// الغلاف الأمامي
const FrontCover = ({ onFlip, lang }) => (
  <div className="flex flex-col justify-center items-center w-full h-full bg-gradient-to-br from-brown-700 to-brown-900 text-parchment-light p-8">
    <h1 className="text-3xl font-bold mb-4 text-center">
      {lang === "ar" ? "القانون الأساسي الفلسطيني" : "Palestinian Basic Law"}
    </h1>
    <h2 className="text-xl italic mb-8 text-center">
      {lang === "ar" ? "المعدل لعام 2003" : "Amended 2003"}
    </h2>
    <button
      className="bg-gold-500 text-brown-900 px-6 py-3 rounded font-bold shadow-lg hover:bg-gold-600 transition-transform duration-300 hover:-translate-y-1"
      onClick={onFlip}
    >
      {lang === "ar" ? "ابدأ القراءة" : "Start Reading"}
    </button>
  </div>
);

// الغلاف الخلفي
const BackCover = ({ lang }) => (
  <div className="flex flex-col justify-center items-center w-full h-full bg-gradient-to-br from-brown-800 to-brown-700 text-parchment-light p-8">
    <h3 className="text-xl mb-4">
      {lang === "ar" ? "معلومات النشر" : "Publication Info"}
    </h3>
    <p>
      {lang === "ar"
        ? "صدر بمدينة رام الله بتاريخ: 18 / 3 / 2003"
        : "Issued in Ramallah on: 18/3/2003"}
    </p>
  </div>
);

// صفحة داخلية
const Page = ({ content, pageNumber, totalPages }) => (
  <div className="p-6 w-full h-full bg-parchment-light border border-brown-300 overflow-auto">
    <div className="mb-4 text-sm font-bold text-brown-700">
      الصفحة {pageNumber} / {totalPages}
    </div>
    <div>{formatPage(content)}</div>
  </div>
);

const ConstitutionFlipBook = () => {
  const bookRef = useRef();
  const [lang, setLang] = useState("ar");
  const pages = splitIntoPages(lang === "ar" ? arabicText : englishText);

  // تقليب الغلاف الأمامي حسب اللغة
  const flipToFirstPage = () => {
    if (!bookRef.current) return;
    if (lang === "ar") {
      bookRef.current.pageFlip().flip(pages.length); // العربية تبدأ من الغلاف الأيمن
    } else {
      bookRef.current.pageFlip().flip(2); // الإنجليزية من الصفحة الثانية
    }
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-br from-parchment-light to-parchment-dark font-serif">
      {/* أزرار اللغة */}
      <div className="mb-4">
        <button
          onClick={() => setLang("ar")}
          className={`px-4 py-2 mx-2 rounded font-bold shadow-md ${
            lang === "ar"
              ? "bg-brown-800 text-parchment-light"
              : "bg-brown-600 text-parchment-light"
          }`}
        >
          🇵🇸 عربي
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-4 py-2 mx-2 rounded font-bold shadow-md ${
            lang === "en"
              ? "bg-brown-800 text-parchment-light"
              : "bg-brown-600 text-parchment-light"
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      <HTMLFlipBook
        width={700}
        height={900}
        showCover={true}
        usePortrait={true}
        drawShadow={true}
        flippingTime={800}
        ref={bookRef}
        style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
      >
        {/* الغلاف الأمامي */}
        <div>
          <FrontCover onFlip={flipToFirstPage} lang={lang} />
        </div>

        {/* الصفحات الداخلية */}
        {pages.map((page, idx) => (
          <div key={idx}>
            <Page
              content={page}
              pageNumber={idx + 1}
              totalPages={pages.length}
            />
          </div>
        ))}

        {/* الغلاف الخلفي */}
        <div>
          <BackCover lang={lang} />
        </div>
      </HTMLFlipBook>

      {/* أزرار التنقل */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          className="px-4 py-2 bg-brown-600 text-parchment-light rounded hover:bg-brown-700"
        >
          {lang === "ar" ? "السابق" : "Previous"}
        </button>
        <button
          onClick={() => bookRef.current.pageFlip().flipNext()}
          className="px-4 py-2 bg-brown-600 text-parchment-light rounded hover:bg-brown-700"
        >
          {lang === "ar" ? "التالي" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ConstitutionFlipBook;
