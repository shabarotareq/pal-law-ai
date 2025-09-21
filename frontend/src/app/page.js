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

  // تحديث اتجاه الصفحة والخطوط
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    const font = lang === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif";

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.style.fontFamily = font;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => (prev === "ar" ? "en" : "ar"));

  const features = [
    {
      titleAr: "محكمة تفاعلية",
      titleEn: "Interactive Court",
      descAr: "قاعة محكمة ثلاثية الأبعاد بتجربة واقع افتراضي غامرة.",
      descEn: "3D virtual courtroom with immersive VR experience.",
      icon: "⚖️",
    },
    {
      titleAr: "ذكاء اصطناعي",
      titleEn: "Artificial Intelligence",
      descAr: "تحليل القضايا وتوليد المرافعات الذكية باستخدام الذكاء الاصطناعي.",
      descEn: "AI-powered case analysis and smart pleadings generation.",
      icon: "🤖",
    },
    {
      titleAr: "تعدد المستخدمين",
      titleEn: "Multi-User Support",
      descAr: "مشاركة القضاة، المحامين، والشهود من مختلف الأجهزة والمواقع.",
      descEn: "Collaboration between judges, lawyers, and witnesses across devices.",
      icon: "👥",
    },
    {
      titleAr: "معرفة قانونية",
      titleEn: "Legal Knowledge",
      descAr: "قاعدة معرفة شاملة بالقوانين والأحكام والإجراءات القانونية.",
      descEn: "Comprehensive knowledge base of laws, judgments, and legal procedures.",
      icon: "📚",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar lang={lang} toggleLanguage={toggleLanguage} />

      {/* Judicial Marquee */}
      <JudicialMarquee lang={lang} />

      {/* الصفحة الرئيسية مع Sidebar */}
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
                  fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Roboto, sans-serif",
                }}
              >
                {lang === "ar" ? "مميزات المنصة" : "Platform Features"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-center">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    title={lang === "ar" ? feature.titleAr : feature.titleEn}
                    description={lang === "ar" ? feature.descAr : feature.descEn}
                    icon={feature.icon}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

