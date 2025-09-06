import { Link } from "react-router-dom";
import { getProfile, logout } from "../../services/authService";
import { useEffect, useState } from "react";
import logo from "../../assets/logo192.jpg";

const Navbar = ({ lang, toggleLanguage }) => {
  const [me, setMe] = useState(null);
  const [time, setTime] = useState(new Date());

  // جلب بيانات المستخدم
  useEffect(() => {
    (async () => {
      try {
        setMe(await getProfile());
      } catch {}
    })();
  }, []);

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const navButtons = [
    { ar: "الدستور الفلسطيني", en: "Pal Constitution", link: "/constitution" },
    { ar: "المحاكم الفلسطينية", en: "Pal Courts", link: "/palestinian-courts" },
    {
      ar: "المحاكم الدولية",
      en: "International Courts",
      link: "/international-courts",
    },
    { ar: "القوانين الفلسطينية", en: "Pal Laws", link: "/palestinian-laws" },
    {
      ar: "القوانين والقرارات الدولية",
      en: "International Laws & Decrees",
      link: "/international-laws",
    },
    { ar: "المراجع والكتب", en: "References & Books", link: "/references" },
    { ar: "إجراءات التقاضي", en: "Litigation Procedures", link: "/litigation" },
  ];

  return (
    <header className="shadow-md">
      {/* الشريط العلوي */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white px-6 py-3 flex items-center justify-between">
        {/* التاريخ والوقت */}
        <div className="text-xs md:text-sm font-mono">
          {time.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
        </div>

        {/* عبارة القوانين */}
        <div className="text-xl md:text-2xl font-extrabold tracking-widest text-yellow-300 font-cairo text-center">
          {lang === "ar"
            ? "القوانين والتشريعات الفلسطينية والدولية"
            : "Pal & International Laws and Legislations"}
        </div>

        {/* زر الدخول/الخروج وتبديل اللغة */}
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
            <Link
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
              to="/login"
            >
              {lang === "ar" ? "دخول" : "Login"}
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
        {/* اللوجو واسم المنصة */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-blue-700"
          >
            <img src={logo} alt="عدالة AI" className="w-10 h-10" />
            <span>{lang === "ar" ? "عدالة AI" : "Justice AI"}</span>
          </Link>

          {/* الأزرار بجانب اللوجو */}
          <ul className="flex items-center gap-3 mr-6">
            {navButtons.map((btn, idx) => (
              <li key={idx}>
                <Link
                  to={btn.link}
                  className="px-3 py-1 rounded hover:bg-blue-100 hover:text-blue-700 transition font-semibold whitespace-nowrap"
                >
                  {lang === "ar" ? btn.ar : btn.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
