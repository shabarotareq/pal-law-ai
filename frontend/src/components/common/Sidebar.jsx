import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

const Sidebar = ({ lang = "ar", isOpen = true, onClose, currentUser }) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [heroHeight, setHeroHeight] = useState("100vh");
  const router = useRouter();

  const mainItems = [
    { to: "/", text: { ar: "الصفحة الرئيسية", en: "Home" }, icon: "🏠" },
    {
      text: { ar: "المحكمة الافتراضية", en: "Virtual Court" },
      icon: "⚖️",
      special: true,
      action: () => {
        const newCaseId = uuidv4();
        router.push(`/court/${newCaseId}`);
      },
    },
    { to: "/about", text: { ar: "حول المنصة", en: "About" }, icon: "ℹ️" },
    { to: "/contact", text: { ar: "اتصل بنا", en: "Contact" }, icon: "📞" },
    {
      to: "/dashboard",
      text: { ar: "لوحة التحكم", en: "Dashboard" },
      icon: "📊",
    },
    { to: "/profile", text: { ar: "ملفي", en: "My Profile" }, icon: "👤" },
    {
      to: "/api-settings",
      text: { ar: "إعدادات API", en: "API Settings" },
      icon: "🔑",
    },
  ];

  useEffect(() => {
    const updateHeroDimensions = () => {
      const hero = document.querySelector("#hero-section");
      if (hero) {
        setHeroHeight(`${hero.offsetHeight}px`);
      }
    };
    updateHeroDimensions();
    window.addEventListener("resize", updateHeroDimensions);
    return () => window.removeEventListener("resize", updateHeroDimensions);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      rotateX: ((y - centerY) / centerY) * 5,
      rotateY: ((centerX - x) / centerX) * 5,
    });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  const marginValue = "0rem"; // نفس قيمة px-6 في Navbar

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          height: heroHeight,
          marginTop: "1px",
          [lang === "ar" ? "right" : "left"]: marginValue, // ضبط الهامش الأيمن/الأيسر مساوي للـ Navbar
          transform: `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: "transform 0.1s ease-out",
        }}
        className={`
          fixed md:relative w-64 p-6
          bg-gradient-to-b from-purple-800 via-pink-700 to-red-700/70
          backdrop-blur-lg shadow-2xl rounded-2xl
          text-white font-cairo flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : lang === "ar"
              ? "translate-x-full"
              : "-translate-x-full md:translate-x-0"
          }
          z-50
        `}
      >
        <button
          className={`md:hidden absolute top-4 ${
            lang === "ar" ? "left-4" : "right-4"
          } text-xl text-white`}
          onClick={onClose}
          aria-label={lang === "ar" ? "إغلاق القائمة" : "Close menu"}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {lang === "ar" ? "القائمة" : "Menu"}
        </h2>

        <ul className="flex flex-col gap-4">
          {mainItems.map((item, idx) => (
            <li key={idx}>
              {item.action ? (
                <button
                  onClick={item.action}
                  className="flex items-center gap-2 px-3 py-2 rounded w-full text-left transition bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
                >
                  <span>{item.icon}</span>
                  <span>{item.text[lang === "ar" ? "ar" : "en"]}</span>
                </button>
              ) : (
                <Link href={item.to} passHref>
                  <a
                    className="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-white hover:bg-opacity-20"
                    onClick={() => window.innerWidth < 768 && onClose()}
                  >
                    <span>{item.icon}</span>
                    <span>{item.text[lang === "ar" ? "ar" : "en"]}</span>
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6 border-t border-white border-opacity-30 text-sm text-white text-opacity-70">
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
