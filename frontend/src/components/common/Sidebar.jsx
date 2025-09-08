import React, { useState } from "react";
import { Link } from "react-router-dom";
import VirtualCourt from "../virtual_court/VirtualCourt";

const Sidebar = ({ lang = "ar", isOpen = true, onClose }) => {
  const [showCourt, setShowCourt] = useState(false);

  const mainItems = [
    { to: "/", text: { ar: "الصفحة الرئيسية", en: "Home" }, icon: "🏠" },
    {
      text: { ar: "المحكمة الافتراضية", en: "Virtual Court" },
      icon: "⚖️",
      special: true,
      action: () => setShowCourt(true),
    },
    { to: "/about", text: { ar: "حول المنصة", en: "About" }, icon: "ℹ️" },
    { to: "/contact", text: { ar: "اتصل بنا", en: "Contact" }, icon: "📞" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className="fixed md:relative top-0 left-0 h-full w-64 p-6 bg-gradient-to-b from-purple-800 via-pink-700 to-red-700/70 text-white z-50">
        <h2 className="text-2xl font-bold mb-6">
          {lang === "ar" ? "القائمة" : "Menu"}
        </h2>
        <ul className="flex flex-col gap-4">
          {mainItems.map((item, idx) => (
            <li key={idx}>
              {item.to ? (
                <Link to={item.to}>
                  {item.text[lang === "ar" ? "ar" : "en"]}
                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition ${
                    item.special
                      ? "bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
                      : "hover:bg-white hover:bg-opacity-20"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.text[lang === "ar" ? "ar" : "en"]}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {showCourt && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80">
          <button
            className="absolute top-4 right-4 text-white text-xl z-50"
            onClick={() => setShowCourt(false)}
          >
            ✕
          </button>
          <VirtualCourt currentUser={{ id: "user123" }} roomId="main" />
        </div>
      )}
    </>
  );
};

export default Sidebar;
