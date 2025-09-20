import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

// صفحات ومكونات
import ConstitutionFlip from "./pages/Constitution2";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Footer from "./components/common/Footer";
import JudicialMarquee from "./components/common/JudicialMarquee";
import AppRoutes from "./AppRoutes";
import NewsComponent from "./components/common/NewsComponent";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorFallback from "./components/common/ErrorFallback";

// سياقات
import { useAuth } from "./contexts/AuthContext";
import { LegalKnowledgeProvider } from "./contexts/LegalKnowledgeContext";

// Lazy load
const HeroSection = lazy(() => import("./components/landing/HeroSection"));
const FeatureCard = lazy(() => import("./components/auth/FeatureCard"));
const CourtPage = lazy(() => import("./pages/court/CasePage"));

const App = () => {
  const location = useLocation();
  const [lang, setLang] = useState("ar");
  const { currentUser, loading: authLoading } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // ضبط اللغة والعنوان
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    document.documentElement.classList.remove("lang-ar", "lang-en");
    document.documentElement.classList.add(`lang-${lang}`);

    document.title =
      lang === "ar"
        ? "منصة عدالة AI - القضاء الفلسطيني الافتراضي"
        : "Adalah AI - Palestinian Virtual Judicial Platform";
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  const getDelayColor = (delay) => {
    if (delay === 0) return "bg-green-600";
    if (delay <= 2) return "bg-yellow-500";
    return "bg-red-600";
  };

  // بيانات التبويبات في المحكمة الافتراضية
  const tabs = [
    {
      title: "الانترنت",
      content: (
        <table className="w-full text-white border border-white/40">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-white/40">الخوادم</th>
              <th className="p-2 border border-white/40">الجلسة</th>
              <th className="p-2 border border-white/40">الشخوص</th>
              <th className="p-2 border border-white/40">الخريطة</th>
              <th className="p-2 border border-white/40">التأخير</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                server: "خادم 1",
                session: "9:00",
                persons: "القاضي، المحامي",
                map: "مركز المدينة",
                delay: 0,
              },
              {
                server: "خادم 2",
                session: "9:30",
                persons: "شاهد، محامي",
                map: "الفرعية",
                delay: 2,
              },
            ].map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-white/40">{row.server}</td>
                <td className="p-2 border border-white/40">{row.session}</td>
                <td className="p-2 border border-white/40">{row.persons}</td>
                <td className="p-2 border border-white/40">{row.map}</td>
                <td
                  className={`p-2 border border-white/40 text-center ${getDelayColor(
                    row.delay
                  )}`}
                >
                  {row.delay} ثانية
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      buttons: ["تغيير التصفيات", "تحديث سريع", "تحديث الكل", "اتصال"],
    },
    {
      title: "المفضلة",
      content: (
        <table className="w-full text-white border border-white/40">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-white/40">الخوادم</th>
              <th className="p-2 border border-white/40">الجلسة</th>
              <th className="p-2 border border-white/40">الشخوص</th>
              <th className="p-2 border border-white/40">الخريطة</th>
              <th className="p-2 border border-white/40">التأخير</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                server: "خادم 3",
                session: "10:00",
                persons: "محامي، شاهد",
                map: "الوسطى",
                delay: 1,
              },
            ].map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-white/40">{row.server}</td>
                <td className="p-2 border border-white/40">{row.session}</td>
                <td className="p-2 border border-white/40">{row.persons}</td>
                <td className="p-2 border border-white/40">{row.map}</td>
                <td
                  className={`p-2 border border-white/40 text-center ${getDelayColor(
                    row.delay
                  )}`}
                >
                  {row.delay} ثانية
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      buttons: ["تغيير التصفيات", "إضافة خادم", "تحديث", "اتصال"],
    },
    {
      title: "التاريخ",
      content: (
        <table className="w-full text-white border border-white/40">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-white/40">الخوادم</th>
              <th className="p-2 border border-white/40">الجلسة</th>
              <th className="p-2 border border-white/40">الشخوص</th>
              <th className="p-2 border border-white/40">الخريطة</th>
              <th className="p-2 border border-white/40">التأخير</th>
              <th className="p-2 border border-white/40">آخر جلسة</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                server: "خادم 1",
                session: "9:00",
                persons: "القاضي، المحامي",
                map: "مركز المدينة",
                delay: 0,
                lastSession: "12/08/2025",
              },
              {
                server: "خادم 2",
                session: "9:30",
                persons: "شاهد، محامي",
                map: "الفرعية",
                delay: 2,
                lastSession: "11/08/2025",
              },
            ].map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-white/40">{row.server}</td>
                <td className="p-2 border border-white/40">{row.session}</td>
                <td className="p-2 border border-white/40">{row.persons}</td>
                <td className="p-2 border border-white/40">{row.map}</td>
                <td
                  className={`p-2 border border-white/40 text-center ${getDelayColor(
                    row.delay
                  )}`}
                >
                  {row.delay} ثانية
                </td>
                <td className="p-2 border border-white/40 text-center">
                  {row.lastSession}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      buttons: ["تغيير التصفيات", "تحديث", "اتصال"],
    },
    {
      title: "المعاينة",
      content: <div className="text-white">محتوى المعاينة هنا...</div>,
      buttons: ["تغيير التصفيات", "تحديث سريع", "تحديث الكل", "اتصال"],
    },
    {
      title: "شبكة محلية",
      content: <div className="text-white">محتوى الشبكة المحلية هنا...</div>,
      buttons: ["تغيير التصفيات", "تحديث", "اتصال"],
    },
    {
      title: "الزملاء",
      content: <div className="text-white">محتوى الزملاء هنا...</div>,
      buttons: ["تغيير التصفيات", "تحديث", "اتصال"],
    },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner
          size="large"
          text={
            lang === "ar" ? "جاري التحقق من المصادقة..." : "Authenticating..."
          }
        />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LegalKnowledgeProvider>
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
              <Suspense fallback={<LoadingSpinner size="medium" />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <HeroSection lang={lang} />
                        <NewsComponent lang={lang} />
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
                              {lang === "ar"
                                ? "مميزات المنصة"
                                : "Platform Features"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-center">
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
                              <FeatureCard
                                title={
                                  lang === "ar"
                                    ? "معرفة قانونية"
                                    : "Legal Knowledge"
                                }
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
                      </>
                    }
                  />

                  <Route path="/constitution" element={<ConstitutionFlip />} />
                  <Route
                    path="/court/:caseId"
                    element={
                      <CourtPage
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        showOverlay={showOverlay}
                        setShowOverlay={setShowOverlay}
                      />
                    }
                  />

                  <Route path="/*" element={<AppRoutes lang={lang} />} />
                </Routes>
              </Suspense>
            </main>
          </div>

          <Footer lang={lang} setLang={setLang} />
        </div>
      </LegalKnowledgeProvider>
    </ErrorBoundary>
  );
};

export default App;
