import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo192.jpg"; // ✅ استيراد اللوجو من assets

const Footer = ({ lang }) => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* معلومات التواصل */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                {lang === "ar" ? "هاتف: 0598883667" : "Phone: +970598883667"}
              </li>
              <li>
                {lang === "ar"
                  ? "بريد إلكتروني: info@cnem.online"
                  : "Email: info@cnem.online"}
              </li>
              <li>
                {lang === "ar"
                  ? "عنوان: نابلس، فلسطين"
                  : "Address: Nablus, Palestine"}
              </li>
            </ul>
          </div>

          {/* شركاؤنا */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {lang === "ar" ? "شركاؤنا" : "Our Partners"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "وزارة العدل الفلسطينية"
                    : "Palestinian Ministry of Justice"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "نقابة المحامين الفلسطينيين"
                    : "Palestinian Bar Association"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "مجمع المحاكم الفلسطيني"
                    : "Palestinian Courts Complex"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "مركز القضاء والتقنية"
                    : "Judiciary & Technology Center"}
                </a>
              </li>
            </ul>
          </div>

          {/* مواقع صديقة */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {lang === "ar" ? "مواقع صديقة" : "Friendly Sites"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "الجهاز المركزي للإحصاء الفلسطيني"
                    : "Palestinian Central Bureau of Statistics"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "مجلس القضاء الأعلى"
                    : "High Judicial Council"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "وزارة الداخلية الفلسطينية"
                    : "Ministry of Interior"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  {lang === "ar"
                    ? "هيئة مكافحة الفساد"
                    : "Anti-Corruption Commission"}
                </a>
              </li>
            </ul>
          </div>

          {/* روابط أساسية */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {lang === "ar" ? "روابط" : "Links"}
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:underline">
                  {lang === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  {lang === "ar" ? "من نحن" : "About"}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  {lang === "ar" ? "تواصل معنا" : "Contact"}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          {/* اللوجو + الاسم */}
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src={Logo} alt="عدالة AI" className="w-8 h-8" />
            <span className="font-bold">
              {lang === "ar" ? "عدالة AI" : "Justice AI"}
            </span>
          </div>

          {/* حقوق النشر */}
          <p>
            {lang === "ar"
              ? "© 2025 عدالة AI. جميع الحقوق محفوظة | منصة المساعد القانوني الذكي الفلسطيني"
              : "© 2025 Justice AI. All rights reserved | Palestinian Smart Legal Assistant Platform"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
