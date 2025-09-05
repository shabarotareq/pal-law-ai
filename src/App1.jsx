import React from "react";
import { useLocation, Link } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import "./styles/App.css";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import FeatureCard from "./components/auth/FeatureCard";

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {isHomePage ? (
          <>
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  منصة Pal-Law-AI
                </h1>
                <p className="text-lg md:text-2xl mb-6">
                  المحكمة الافتراضية الذكية لحل القضايا بالذكاء الاصطناعي
                </p>
                <Link to="/login" className="inline-block">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100">
                    ابدأ الآن
                  </button>
                </Link>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-10">مميزات المنصة</h2>
                <div className="flex flex-wrap gap-6 justify-center">
                  <FeatureCard
                    title="محكمة تفاعلية"
                    description="قاعة محكمة ثلاثية الأبعاد بتجربة واقع افتراضي."
                  />
                  <FeatureCard
                    title="ذكاء اصطناعي"
                    description="تحليل القضايا وتوليد المرافعات الذكية."
                  />
                  <FeatureCard
                    title="تعدد المستخدمين"
                    description="مشاركة القضاة، المحامين، والشهود من مختلف الأجهزة."
                  />
                </div>
              </div>
            </section>
          </>
        ) : (
          <AppRoutes />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
