import React from "react";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "users", label: "إدارة المستخدمين", adminOnly: true },
    { id: "settings", label: "الإعدادات", adminOnly: true },
    { id: "virtualCourt", label: "المحكمة الافتراضية" },
  ];

  const canAccess = (item) => !item.adminOnly || user?.role === "admin";

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {menuItems.filter(canAccess).map((item) => (
        <button key={item.id}>{item.label}</button>
      ))}
      <button onClick={logout}>تسجيل الخروج</button>
    </div>
  );
};

export default Sidebar;
