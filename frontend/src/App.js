import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import HeroSection from "./components/landing/HeroSection";
import FeatureCard from "./components/auth/FeatureCard";
import JudicialMarquee from "./components/common/JudicialMarquee";
import AppRoutes from "./AppRoutes";
import { useAuth } from "./contexts/AuthContext"; // استيراد useAuth

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [lang, setLang] = useState("ar");
  const { currentUser } = useAuth(); // استخدام بيانات المستخدم

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang(lang === "ar" ? "en" : "ar");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        lang={lang}
        toggleLanguage={toggleLanguage}
        currentUser={currentUser}
      />
      <JudicialMarquee lang={lang} />
      <div className="flex flex-grow">
        <Sidebar lang={lang} currentUser={currentUser} />
        <main className="flex-grow p-6">
          {isHomePage ? (
            <>
              <HeroSection lang={lang} />
              <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-10"
                    style={{
                      fontFamily:
                        lang === "ar"
                          ? "Cairo, sans-serif"
                          : "Roboto, sans-serif",
                    }}
                  >
                    {lang === "ar" ? "مميزات المنصة" : "Platform Features"}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                    <FeatureCard
                      title={
                        lang === "ar" ? "محكمة تفاعلية" : "Interactive Court"
                      }
                      description={
                        lang === "ar"
                          ? "قاعة محكمة ثلاثية الأبعاد بتجربة واقع افتراضي."
                          : "3D virtual courtroom with immersive experience."
                      }
                      icon="⚖️"
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
                          : "Case analysis and smart pleadings generation."
                      }
                      icon="🤖"
                    />
                    <FeatureCard
                      title={
                        lang === "ar" ? "تعدد المستخدمين" : "Multi-User Support"
                      }
                      description={
                        lang === "ar"
                          ? "مشاركة القضاة، المحامين، والشهود من مختلف الأجهزة."
                          : "Collaboration between judges, lawyers, and witnesses."
                      }
                      icon="👥"
                    />
                  </div>
                </div>
              </section>
            </>
          ) : (
            <AppRoutes lang={lang} />
          )}
        </main>
      </div>
      <Footer lang={lang} setLang={setLang} />
    </div>
  );
};

export default App;
