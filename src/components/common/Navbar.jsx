import { Link } from "react-router-dom";
import { getProfile, logout } from "../../services/authService";
import { useEffect, useState } from "react";
import Logo from "../../assets/logo192.jpg";

const Navbar = ({ lang = "ar", toggleLanguage, onMenuClick }) => {
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setMe(await getProfile());
      } catch {}
    })();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient shadow-md px-6 py-3 flex items-center justify-between text-white">
      {/* زر القائمة للجوال */}
      <button
        className="lg:hidden text-2xl"
        onClick={onMenuClick}
        aria-label={lang === "ar" ? "فتح القائمة" : "Open menu"}
      >
        ☰
      </button>

      {/* Logo + اسم المنصة */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <img src={Logo} alt="عدالة AI" className="w-10 h-10 rounded-full" />
        <span className="hidden sm:inline">
          {lang === "ar" ? "عدالة AI" : "Justice AI"}
        </span>
      </Link>

      {/* روابط التنقل (لأجهزة الكمبيوتر) */}
      <ul className="hidden lg:flex items-center gap-6 font-medium">
        {me?.role === "admin" && (
          <>
            <li>
              <Link className="hover:underline" to="/admin">
                {lang === "ar" ? "لوحة المدير" : "Admin Panel"}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/admin/users">
                {lang === "ar" ? "المستخدمون" : "Users"}
              </Link>
            </li>
            <li>
              <Link className="hover:underline" to="/admin/cases">
                {lang === "ar" ? "قضايا النظام" : "System Cases"}
              </Link>
            </li>
          </>
        )}
        <li>
          <Link className="hover:underline" to="/cases">
            {lang === "ar" ? "القضايا" : "Cases"}
          </Link>
        </li>
        <li>
          <Link className="hover:underline" to="/about">
            {lang === "ar" ? "من نحن" : "About Us"}
          </Link>
        </li>
        <li>
          <Link className="hover:underline" to="/contact">
            {lang === "ar" ? "تواصل معنا" : "Contact"}
          </Link>
        </li>
      </ul>

      {/* زر الدخول/الخروج + تبديل اللغة */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition text-sm font-medium"
          aria-label={
            lang === "ar" ? "تبديل اللغة إلى الإنجليزية" : "Switch to Arabic"
          }
        >
          {lang === "ar" ? "EN" : "ع"}
        </button>

        {me ? (
          <button
            className="px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-gray-100 transition"
            onClick={handleLogout}
          >
            {lang === "ar" ? "خروج" : "Logout"}
          </button>
        ) : (
          <Link
            className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition"
            to="/login"
          >
            {lang === "ar" ? "دخول" : "Login"}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
