import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Sidebar from "../common/Sidebar";
import Analytics from "./Analytics";
import UserManagement from "./UserManagement";
import Settings from "./Settings";
import Profile from "./Profile";
import VirtualCourt from "../court/VirtualCourt";
import LegalChatBot from "../legal_knowledge/LegalChatBot";
import LegalSearch from "../legal_knowledge/LegalSearch";
import LawBrowser from "../legal_knowledge/LawBrowser";
import JudgmentViewer from "../legal_knowledge/JudgmentViewer";
import ProcedureGuide from "../legal_knowledge/ProcedureGuide";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case "analytics":
        return <Analytics />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <Settings />;
      case "virtual-court":
        return <VirtualCourt />;
      case "profile":
        return <Profile />;
      case "legal-chat":
        return <LegalChatBot />;
      case "legal-search":
        return <LegalSearch />;
      case "law-browser":
        return <LawBrowser />;
      case "judgment-viewer":
        return <JudgmentViewer />;
      case "procedure-guide":
        return <ProcedureGuide />;
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {getTabTitle(activeTab)}
            </h2>
            <p className="text-gray-600">
              محتوى {getTabTitle(activeTab)} سيظهر هنا...
            </p>
          </div>
        );
    }
  };

  const getTabTitle = (tab) => {
    const titles = {
      analytics: "الإحصائيات",
      users: "إدارة المستخدمين",
      settings: "الإعدادات",
      "virtual-court": "المحكمة الافتراضية",
      profile: "الملف الشخصي",
      "legal-chat": "المساعد القانوني",
      "legal-search": "البحث القانوني",
      "law-browser": "متصفح القوانين",
      "judgment-viewer": "عارض الأحكام",
      "procedure-guide": "دليل الإجراءات",
    };
    return titles[tab] || tab;
  };

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
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-gray-600">{getTabDescription(activeTab)}</p>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

// دالة للحصول على وصف كل تبويب
const getTabDescription = (tab) => {
  const descriptions = {
    analytics: "عرض الإحصائيات والأداء العام للمنصة",
    users: "إدارة مستخدمي النظام والصلاحيات",
    settings: "تعديل إعدادات النظام والتخصيص",
    "virtual-court": "إدارة جلسات المحكمة الافتراضية",
    profile: "إدارة معلوماتك الشخصية والإعدادات",
    "legal-chat": "محادثة مع المساعد القانوني الذكي للاستشارات",
    "legal-search": "بحث متقدم في القوانين والأحكام والإجراءات",
    "law-browser": "استعراض وتصفح القوانين والمواد القانونية",
    "judgment-viewer": "عرض واستكشاف الأحكام القضائية",
    "procedure-guide": "دليل خطوات الإجراءات القانونية والمرافعات",
  };
  return descriptions[tab] || "إدارة محتوى النظام";
};

export default Dashboard;

