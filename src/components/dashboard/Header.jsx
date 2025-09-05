import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        {/* اللوجو + اسم المنصة */}
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <h1 className="platform-name">عدالة AI</h1>
        </div>

        {/* Navbar */}
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">الرئيسية</Link>
            </li>
            <li>
              <Link to="/chat">الدردشة</Link>
            </li>
            <li>
              <Link to="/laws">القوانين</Link>
            </li>
            <li>
              <Link to="/statistics">الإحصائيات</Link>
            </li>
            <li>
              <Link to="/dashboard">لوحة التحكم</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
