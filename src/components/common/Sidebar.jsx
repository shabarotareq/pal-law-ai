import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ lang = "ar", isOpen, onClose }) => {
  // العناصر الرئيسية مع دعم اللغات
  const mainItems = [
    { to: "/", text: { ar: "الصفحة الرئيسية", en: "Home" }, icon: "🏠" },
    { to: "/cases", text: { ar: "القضايا", en: "Cases" }, icon: "📂" },
    { to: "/about", text: { ar: "حول المنصة", en: "About" }, icon: "ℹ️" },
    { to: "/contact", text: { ar: "اتصل بنا", en: "Contact" }, icon: "📞" },
    {
      to: "/dashboard",
      text: { ar: "لوحة التحكم", en: "Dashboard" },
      icon: "📊",
    },
    { to: "/profile", text: { ar: "ملفي", en: "My Profile" }, icon: "👤" },
  ];

  return (
    <>
      {/* Overlay للجوال */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`
        fixed md:relative top-0 left-0 h-full bg-gradient-to-b from-purple-700 via-pink-600 to-red-500 animate-gradient text-white p-6 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        w-64 flex-shrink-0
        ${lang === "ar" ? "text-right" : "text-left"}
      `}
      >
        {/* زر الإغلاق للجوال */}
        <button
          className="md:hidden absolute top-4 left-4 text-xl text-white"
          onClick={onClose}
          aria-label={lang === "ar" ? "إغلاق القائمة" : "Close menu"}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {lang === "ar" ? "القائمة" : "Menu"}
        </h2>

        <ul className="space-y-4">
          {mainItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white hover:bg-opacity-20 transition"
                onClick={() => window.innerWidth < 768 && onClose()}
              >
                <span>{item.icon}</span>
                <span>{item.text[lang === "ar" ? "ar" : "en"]}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* معلومات إضافية في الأسفل */}
        <div className="mt-8 pt-6 border-t border-white border-opacity-30 text-sm text-white text-opacity-70">
          <p className="mb-2">
            {lang === "ar"
              ? "منصة عدالة AI للمساعدة القانونية"
              : "Adalah AI Legal Assistance Platform"}
          </p>
          <p>v1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
