import "../styles/globals.css";
import { useState, useEffect } from "react";
import { LegalKnowledgeProvider } from "../contexts/LegalKnowledgeContext";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import Herosection from "../components/landing/HeroSection";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import JudicialMarquee from "../components/common/JudicialMarquee";
import ErrorFallback from "../components/common/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

function MyApp({ Component, pageProps }) {
  const [lang, setLang] = useState("ar"); // اللغة الافتراضية عربية

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang === "ar" ? "ar" : "en";
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <LegalKnowledgeProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar lang={lang} toggleLanguage={toggleLanguage} />
            <JudicialMarquee lang={lang} />

            <div className="flex flex-grow">
              <Sidebar lang={lang} toggleLanguage={toggleLanguage} />
              <main className="flex-grow p-2 md:p-3 lg:p-4">
                {/* يمكنك التحكم في عرض Herosection فقط للصفحة الرئيسية */}
                {pageProps.showHero && (
                  <Herosection lang={lang} toggleLanguage={toggleLanguage} />
                )}
                <Component {...pageProps} />
              </main>
            </div>

            <Footer lang={lang} />
          </div>
        </LegalKnowledgeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
