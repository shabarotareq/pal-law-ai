"use client";

import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

// نصوص عربية وإنجليزية
const arabicText = `2003\nاستناداً إلى المادة ...`;
const englishText = `Amended Basic Law of 2003\nPreamble ...`;

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

// تنسيق محتوى الصفحة
const formatPage = (text, lang) =>
  text.split("\n").map((line, idx) =>
    /^مادة|Article/.test(line.trim()) ? (
      <h2
        key={idx}
        className={`text-xl font-bold my-3 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {line}
      </h2>
    ) : line.trim() === "" ? (
      <br key={idx} />
    ) : (
      <p
        key={idx}
        className={`text-base leading-relaxed my-2 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        {line}
      </p>
    )
  );

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

// الصفحة
const Page = ({ content, pageNumber, totalPages, bookHeight, lang }) => (
  <div
    className={`p-4 w-full bg-parchment-light border border-brown-300 overflow-auto ${
      lang === "ar" ? "flipbook-rtl-content" : ""
    }`}
    style={{ height: `${bookHeight}px` }}
  >
    <div className="mb-2 text-sm font-bold text-brown-700">
      الصفحة {pageNumber} / {totalPages}
    </div>
    <div>{formatPage(content, lang)}</div>
  </div>
);

const Constitution = ({ lang, toggleLanguage, onClose }) => {
  const bookRef = useRef();
  const [bookSize, setBookSize] = useState({ width: 700, height: 900 });
  const pages = splitIntoPages(lang === "ar" ? arabicText : englishText);

  useEffect(() => {
    const updateBookSize = () => {
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 80;
      const aspectRatio = 700 / 900;
      let width = maxWidth;
      let height = width / aspectRatio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      setBookSize({ width, height });
    };
    updateBookSize();
    window.addEventListener("resize", updateBookSize);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") onClose();
    });
    return () => {
      window.removeEventListener("resize", updateBookSize);
    };
  }, [onClose]);

  const flipToFirstPage = () => {
    if (!bookRef.current) return;
    bookRef.current.pageFlip().flip(0);
  };

  const bookPages = [
    <FrontCover key="front" onFlip={flipToFirstPage} lang={lang} />,
    ...pages.map((p, idx) => (
      <Page
        key={idx}
        content={p}
        pageNumber={idx + 1}
        totalPages={pages.length}
        bookHeight={bookSize.height}
        lang={lang}
      />
    )),
    <BackCover key="back" lang={lang} />,
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500 z-50"
        >
          ×
        </button>

        <HTMLFlipBook
          width={bookSize.width}
          height={bookSize.height}
          showCover={true}
          usePortrait={true}
          drawShadow={true}
          flippingTime={800}
          ref={bookRef}
          useSwipe={true}
          swipeDistance={60}
          maxShadowOpacity={0.5}
          startPage={0}
          rtl={lang === "ar" ? false : true} // العربية: تقليب LTR، الإنجليزية: RTL
          className={lang === "ar" ? "flipbook-rtl z-50" : "flipbook-ltr z-50"}
        >
          {bookPages.map((p, idx) => (
            <div key={idx}>{p}</div>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  );
};

export default Constitution;
