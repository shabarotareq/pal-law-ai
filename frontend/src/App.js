import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import JudicialMarquee from "./components/common/JudicialMarquee";
import AppRoutes from "./AppRoutes";
import { useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorFallback from "./components/common/ErrorFallback";

// تحميل بطيء للمكونات الثقيلة
const HeroSection = lazy(() => import("./components/landing/HeroSection"));
const FeatureCard = lazy(() => import("./components/auth/FeatureCard"));

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [lang, setLang] = useState("ar");
  const { currentUser, loading: authLoading } = useAuth();

  // تأثير للغة والاتجاه
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    // إضافة فئة اللغة للعنصر الرئيسي
    document.documentElement.classList.remove("lang-ar", "lang-en");
    document.documentElement.classList.add(`lang-${lang}`);

    // تحديث عنوان الصفحة بناء على اللغة
    document.title =
      lang === "ar"
        ? "منصة القضاء الفلسطيني الافتراضي"
        : "Palestinian Virtual Judicial Platform";
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === "ar" ? "en" : "ar"));
  };

  // إذا كان التحميل جارٍ، عرض spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error("App Error:", error, errorInfo);
        // يمكن إضافة تسجيل الخطأ هنا (Sentry, etc.)
      }}
    >
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar
          lang={lang}
          toggleLanguage={toggleLanguage}
          currentUser={currentUser}
        />

        <JudicialMarquee lang={lang} />

        <div className="flex flex-grow">
          <Sidebar lang={lang} currentUser={currentUser} />

          <main className="flex-grow p-4 md:p-6 lg:p-8 transition-all duration-300">
            {isHomePage ? (
              <>
                <Suspense fallback={<LoadingSpinner />}>
                  <HeroSection lang={lang} />
                </Suspense>

                <section
                  id="features"
                  className="py-12 md:py-16 lg:py-20 bg-white rounded-lg shadow-sm mt-6"
                >
                  <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2
                      className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-10 text-gray-800"
                      style={{
                        fontFamily:
                          lang === "ar"
                            ? "Cairo, sans-serif"
                            : "Roboto, sans-serif",
                      }}
                    >
                      {lang === "ar" ? "مميزات المنصة" : "Platform Features"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-center">
                      <Suspense fallback={<LoadingSpinner size="small" />}>
                        <FeatureCard
                          title={
                            lang === "ar"
                              ? "محكمة تفاعلية"
                              : "Interactive Court"
                          }
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
                            lang === "ar"
                              ? "ذكاء اصطناعي"
                              : "Artificial Intelligence"
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
                            lang === "ar"
                              ? "تعدد المستخدمين"
                              : "Multi-User Support"
                          }
                          description={
                            lang === "ar"
                              ? "مشاركة القضاة، المحامين، والشهود من مختلف الأجهزة والمواقع."
                              : "Collaboration between judges, lawyers, and witnesses across devices."
                          }
                          icon="👥"
                          lang={lang}
                        />
                      </Suspense>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <Suspense fallback={<LoadingSpinner />}>
                <AppRoutes lang={lang} />
              </Suspense>
            )}
          </main>
        </div>

        <Footer lang={lang} setLang={setLang} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
