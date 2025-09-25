"use client"; // Layout كـ Client Component للسماح باستخدام useEffect

import { useState, useEffect } from "react";
import "../styles/globals.css";

import Navbar from "../components/common/Navbar";
import JudicialMarquee from "../components/common/JudicialMarquee";
import Sidebar from "../components/common/Sidebar";

export default function RootLayout({ children }) {
  const [lang, setLang] = useState("ar"); // اللغة الافتراضية: عربية

  // تحديث اتجاه الصفحة واللغة والخطوط تلقائيًا
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    const font = lang === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif";

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.style.fontFamily = font;
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* تحميل الخطوط من Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Amiri:wght@400;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-cairo bg-gray-50 min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar lang={lang} toggleLanguage={toggleLanguage} />

        {/* Judicial Marquee */}
        <JudicialMarquee lang={lang} />

        {/* محتوى الصفحة مع Sidebar */}
        <div className="flex flex-grow">
          {/* Sidebar */}
          <Sidebar lang={lang} toggleLanguage={toggleLanguage} />

          {/* Main Content (الصفحة الحالية) */}
          <main className="flex-grow p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}


