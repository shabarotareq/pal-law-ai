// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import JudicialMarquee from "../components/common/JudicialMarquee";
import Sidebar from "../components/common/Sidebar";
import HeroSection from "../components/landing/HeroSection";
import NewsComponent from "../components/common/NewsComponent";
import FeatureCard from "../components/auth/FeatureCard";

export default function HomePage() {
  const [lang, setLang] = useState("ar"); // اللغة الافتراضية: عربية

  // تحديث اتجاه الصفحة واللغة والخطوط
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    const font = lang === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif";

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.style.fontFamily = font;
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar lang={lang} toggleLanguage={toggleLanguage} />

      {/* Judicial Marquee */}
      <JudicialMarquee lang={lang} />

      {/* محتوى الصفحة الرئيسي مع Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar lang={lang} toggleLanguage={toggleLanguage} />

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          {/* Hero Section */}
          <HeroSection lang={lang} toggleLanguage={toggleLanguage} />

          {/* شريط الأخبار */}
          <NewsComponent lang={lang} />

          {/* قسم الميزات */}
          <section
            id="features"
            className="py-12 md:py-16 lg:py-20 bg-white rounded-lg shadow-sm mt-6"
          >
            <div className="container mx-auto px-4 md:px-6 text-center">
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 text-gray-800"
                style={{
                  fontFamily:
                    lang === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif",
                }}
              >
                {lang === "ar" ? "مميزات المنصة" : "Platform Features"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-center">
                <FeatureCard
                  title={lang === "ar" ? "محكمة تفاعلية" : "Interactive Court"}
                  description={
                    lang === "ar"
                      ? "قاعة محكمة ثلاثية الأبعاد بتجربة واقع افتراضي غامرة."
                      : "3D virtual courtroom with immersive VR experience."
                  }
                  icon="⚖️"
                  lang={lang}
                />
                <FeatureCard
                  title={
                    lang === "ar" ? "ذكاء اصطناعي" : "Artificial Intelligence"
                  }
                  description={
                    lang === "ar"
                      ? "تحليل القضايا وتوليد المرافعات الذكية باستخدام الذكاء الاصطناعي."
                      : "AI-powered case analysis and smart pleadings generation."
                  }
                  icon="🤖"
                  lang={lang}
                />
                <FeatureCard
                  title={
                    lang === "ar" ? "تعدد المستخدمين" : "Multi-User Support"
                  }
                  description={
                    lang === "ar"
                      ? "مشاركة القضاة، المحامين، والشهود من مختلف الأجهزة والمواقع."
                      : "Collaboration between judges, lawyers, and witnesses across devices."
                  }
                  icon="👥"
                  lang={lang}
                />
                <FeatureCard
                  title={lang === "ar" ? "معرفة قانونية" : "Legal Knowledge"}
                  description={
                    lang === "ar"
                      ? "قاعدة معرفة شاملة بالقوانين والأحكام والإجراءات القانونية."
                      : "Comprehensive knowledge base of laws, judgments, and legal procedures."
                  }
                  icon="📚"
                  lang={lang}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
