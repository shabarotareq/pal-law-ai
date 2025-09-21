// pages/_app.js
import "../app/globals.css";
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

  // تحديث اتجاه الصفحة واللغة في <html>
  useEffect(() => {
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, [lang]);

  // تبديل اللغة
  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <LegalKnowledgeProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar lang={lang} toggleLanguage={toggleLanguage} />

            {/* Marquee */}
            <JudicialMarquee lang={lang} />

            <div className="flex flex-grow">
              {/* Sidebar */}
              <Sidebar lang={lang} toggleLanguage={toggleLanguage} />

              {/* Main Content */}
              <main className="flex-grow p-2 md:p-3 lg:p-4">
                {/* Herosection */}
                <Herosection lang={lang} toggleLanguage={toggleLanguage} />
              </main>
            </div>

            {/* Footer */}
            <Footer lang={lang} />
          </div>
        </LegalKnowledgeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default MyApp;

