import React from "react";
import { Button } from "../ui/button";

const HeroSection = ({ lang = "ar" }) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-20 px-6">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {lang === "ar" ? (
            <>
              منصة <span className="text-yellow-300">عدالة AI</span>
            </>
          ) : (
            <>
              <span className="text-yellow-300">Adala AI</span> Platform
            </>
          )}
        </h1>

        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
          {lang === "ar"
            ? "أول منصة عربية تعتمد على الذكاء الاصطناعي والواقع الافتراضي لتقديم الاستشارات القانونية، إدارة المحاكم الافتراضية، والتحليلات القانونية المتقدمة."
            : "The first Arabic platform leveraging AI and virtual reality to provide legal consultations, virtual court management, and advanced legal analytics."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="inline-block">
            <button className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition w-full sm:w-auto">
              {lang === "ar" ? "ابدأ الآن" : "Get Started"}
            </button>
          </a>

          <a href="/about" className="inline-block">
            <button className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-blue-800 transition w-full sm:w-auto">
              {lang === "ar" ? "تعرّف أكثر" : "Learn More"}
            </button>
          </a>
        </div>

        {/* إضافة بعض الإحصائيات أو الميزات */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">1000+</div>
            <p className="text-sm">
              {lang === "ar" ? "قضية معالجة" : "Cases Processed"}
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">99%</div>
            <p className="text-sm">
              {lang === "ar" ? "دقة في التحليل" : "Analysis Accuracy"}
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">24/7</div>
            <p className="text-sm">
              {lang === "ar" ? "دعم متواصل" : "Continuous Support"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
