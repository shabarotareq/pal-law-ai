import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HeroSection from "./components/landing/HeroSection";
import AppRoutes from "./AppRoutes";
import Sidebar from "./components/common/Sidebar";
import FeatureCard from "./components/auth/FeatureCard";

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // حالة اللغة: 'ar' أو 'en'
  const [lang, setLang] = useState("ar");

  // دالة لتبديل اللغة
  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <Navbar lang={lang} toggleLanguage={toggleLanguage} />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar lang={lang} />

        {/* المحتوى الرئيسي */}
        <main className="flex-grow p-6">
          {isHomePage ? (
            <>
              <HeroSection lang={lang} />

              {/* Features Section */}
              <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                  <h2 className="text-3xl font-bold mb-10">
                    {lang === "ar" ? "مميزات المنصة" : "Platform Features"}
                  </h2>
                  <div className="flex flex-wrap gap-6 justify-center">
                    <FeatureCard
                      title={
                        lang === "ar" ? "محكمة تفاعلية" : "Interactive Court"
                      }
                      description={
                        lang === "ar"
                          ? "قاعة محكمة ثلاثية الأبعاد بتجربة واقع افتراضي."
                          : "3D court hall with virtual reality experience."
                      }
                    />
                    <FeatureCard
                      title={
                        lang === "ar"
                          ? "ذكاء اصطناعي"
                          : "Artificial Intelligence"
                      }
                      description={
                        lang === "ar"
                          ? "تحليل القضايا وتوليد المرافعات الذكية."
                          : "Analyze cases and generate smart pleadings."
                      }
                    />
                    <FeatureCard
                      title={lang === "ar" ? "تعدد المستخدمين" : "Multi-User"}
                      description={
                        lang === "ar"
                          ? "مشاركة القضاة، المحامين، والشهود من مختلف الأجهزة."
                          : "Collaborate judges, lawyers, and witnesses across devices."
                      }
                    />
                  </div>
                </div>
              </section>
            </>
          ) : (
            <AppRoutes />
          )}
        </main>
      </div>

      <Footer lang={lang} />
    </div>
  );
};

export default App;
