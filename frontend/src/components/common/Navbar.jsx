// src/components/common/Navbar.js
import { getProfile, logout } from "../../services/authService";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/logo192.jpg";
import Constitution from "../constitution/Constitution"; // تأكد من استيراد الملف الصحيح

const Navbar = ({ lang, toggleLanguage }) => {
  const [me, setMe] = useState(null);
  const [time, setTime] = useState(new Date());
  const [openMenu, setOpenMenu] = useState(null);
  const [showConstitution, setShowConstitution] = useState(false);

  // قراءة اللغة من localStorage عند التحميل
  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang && storedLang !== lang) {
      toggleLanguage(storedLang);
    }
  }, []);

  // حفظ اللغة عند التغيير
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // جلب بيانات المستخدم
  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setMe(profile);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      }
    })();
  }, []);

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // منع التمرير عند ظهور overlay
  useEffect(() => {
    document.body.style.overflow = showConstitution ? "hidden" : "auto";
  }, [showConstitution]);

  const navButtons = [
    {
      ar: "الدستور الفلسطيني",
      en: "Pal Constitution",
      action: () => setShowConstitution(true),
    },
    {
      ar: "القوانين الفلسطينية",
      en: "Pal Laws",
      children: [
        {
          ar: "القانون المدني",
          en: "Civil Law",
          link: "/palestinian-laws/civil",
        },
        {
          ar: "القانون الجنائي",
          en: "Criminal Law",
          link: "/palestinian-laws/criminal",
        },
        {
          ar: "القانون الإداري",
          en: "Administrative Law",
          link: "/palestinian-laws/admin",
        },
      ],
    },
    {
      ar: "المحاكم الفلسطينية",
      en: "Pal Courts",
      children: [
        {
          ar: "المحكمة العليا",
          en: "Supreme Court",
          link: "/palestinian-courts/supreme",
        },
        {
          ar: "محكمة الاستئناف",
          en: "Appeal Court",
          link: "/palestinian-courts/appeal",
        },
        {
          ar: "المحكمة الابتدائية",
          en: "Primary Court",
          link: "/palestinian-courts/primary",
        },
      ],
    },
    { ar: "إجراءات التقاضي", en: "Litigation Procedures", link: "/litigation" },
    {
      ar: "القوانين والقرارات الدولية",
      en: "International Laws & Decrees",
      link: "/international-laws",
    },
    {
      ar: "المحاكم الدولية",
      en: "International Courts",
      children: [
        {
          ar: "محكمة العدل الدولية",
          en: "ICJ",
          link: "/international-courts/icj",
        },
        {
          ar: "المحكمة الجنائية الدولية",
          en: "ICC",
          link: "/international-courts/icc",
        },
      ],
    },
    { ar: "المراجع والكتب", en: "References & Books", link: "/references" },
  ];

  return (
    <>
      <div className={showConstitution ? "pointer-events-none opacity-50" : ""}>
        <header className="shadow-md" dir={lang === "ar" ? "rtl" : "ltr"}>
          {/* الشريط العلوي */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white px-6 py-3 flex items-center justify-between">
            <div className="text-xs md:text-sm font-mono">
              {time.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
            </div>

            <div className="text-xl md:text-2xl font-extrabold tracking-widest text-yellow-300 font-cairo text-center">
              {lang === "ar"
                ? "القوانين والتشريعات الفلسطينية والدولية"
                : "Pal & International Laws and Legislations"}
            </div>

            <div className="flex items-center gap-3">
              {me ? (
                <button
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition"
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                >
                  {lang === "ar" ? "خروج" : "Logout"}
                </button>
              ) : (
                <Link href="/login">
                  <a className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition">
                    {lang === "ar" ? "دخول" : "Login"}
                  </a>
                </Link>
              )}

              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm transition whitespace-nowrap"
              >
                {lang === "ar" ? "English" : "العربية"}
              </button>
            </div>
          </div>

          {/* Navbar الرئيسي */}
          <nav className="bg-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <a className="flex items-center gap-2 text-xl font-bold text-blue-700">
                  <Image src={logo} alt="عدالة AI" width={40} height={40} />
                  <span>{lang === "ar" ? "عدالة AI" : "Justice AI"}</span>
                </a>
              </Link>

              <ul className="flex items-center gap-4 flex-wrap relative">
                {navButtons.map((btn, idx) => (
                  <li
                    key={idx}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(idx)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    {btn.children ? (
                      <>
                        <button className="px-4 py-2 rounded font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition whitespace-nowrap">
                          {lang === "ar" ? btn.ar : btn.en}
                        </button>
                        {openMenu === idx && (
                          <ul className="absolute top-full mt-1 bg-blue-50 shadow-lg rounded p-2 min-w-[200px] z-50">
                            {btn.children.map((child, cIdx) => (
                              <li
                                key={cIdx}
                                className="border-b last:border-b-0 border-blue-200"
                              >
                                <Link href={child.link}>
                                  <a className="block px-4 py-2 rounded text-blue-700 hover:bg-blue-600 hover:text-white transition whitespace-nowrap">
                                    {lang === "ar" ? child.ar : child.en}
                                  </a>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : btn.action ? (
                      <button
                        onClick={btn.action}
                        className="px-4 py-2 rounded font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition whitespace-nowrap"
                      >
                        {lang === "ar" ? btn.ar : btn.en}
                      </button>
                    ) : (
                      <Link href={btn.link}>
                        <a className="px-4 py-2 rounded font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition whitespace-nowrap">
                          {lang === "ar" ? btn.ar : btn.en}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>
      </div>

      {/* Overlay الدستور مع الخلفية المعتمة للمكونات أسفله */}
      {showConstitution && (
        <>
          {/* خلفية معتمة للمكونات أسفل الكتاب */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" />

          {/* الكتاب */}
          <Constitution
            lang={lang}
            toggleLanguage={toggleLanguage}
            onClose={() => setShowConstitution(false)} // زر × و ESC يغلق الكتاب
          />
        </>
      )}
    </>
  );
};

export default Navbar;
