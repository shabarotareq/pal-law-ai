import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Sidebar from "../common/Sidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle for mobile */}
      {user?.role === "admin" && (
        <button
          className="fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ لوحة التحكم
        </button>
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto lg:mr-64">
        {activeTab === "analytics" && (
          <h1 className="text-2xl font-bold mb-4">صفحة الإحصائيات</h1>
        )}
        {activeTab === "users" && (
          <h1 className="text-2xl font-bold mb-4">إدارة المستخدمين</h1>
        )}
        {activeTab === "settings" && (
          <h1 className="text-2xl font-bold mb-4">الإعدادات</h1>
        )}
        {activeTab === "virtual-court" && (
          <h1 className="text-2xl font-bold mb-4">المحكمة الافتراضية</h1>
        )}
        {activeTab === "profile" && (
          <h1 className="text-2xl font-bold mb-4">الملف الشخصي</h1>
        )}

        <div className="mt-4 p-4 bg-white rounded shadow">
          <p>محتوى {activeTab} سيظهر هنا...</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
