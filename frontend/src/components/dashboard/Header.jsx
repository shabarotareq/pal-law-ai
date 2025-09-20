// src/components/dashboard/Header.jsx
import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

const Header = ({ lang = "ar" }) => {
  return (
    <header
      className={`flex items-center justify-between px-6 py-4 bg-gray-900 text-white ${styles.header}`}
    >
      {/* اللوجو + اسم المنصة */}
      <div
        className={`flex items-center gap-4 ${
          lang === "ar" ? "ml-auto" : "mr-auto"
        }`}
      >
        <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
        <h1 className="text-xl font-bold">
          {lang === "ar" ? "عدالة AI" : "Adalah AI"}
        </h1>
      </div>

      {/* Navbar */}
      <nav
        className={`flex items-center gap-6 ${
          lang === "ar" ? "mr-auto" : "ml-auto"
        }`}
      >
        <Link href="/">
          <a>{lang === "ar" ? "الرئيسية" : "Home"}</a>
        </Link>
        <Link href="/chat">
          <a>{lang === "ar" ? "الدردشة" : "Chat"}</a>
        </Link>
        <Link href="/laws">
          <a>{lang === "ar" ? "القوانين" : "Laws"}</a>
        </Link>
        <Link href="/statistics">
          <a>{lang === "ar" ? "الإحصائيات" : "Statistics"}</a>
        </Link>
        <Link href="/dashboard">
          <a>{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</a>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
