import React, { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import {
  updateSettings,
  getSettings,
  resetSettings,
} from "../../services/settings";
import LoadingSpinner from "../common/LoadingSpinner";
import Notification from "../common/Notification";

const Settings = () => {
  const { theme, updateTheme } = useTheme();
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    appearance: {
      themeMode: "light",
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: "Cairo, sans-serif",
      fontSize: "medium",
      borderRadius: "8px",
      shadowIntensity: "medium",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: false,
      newsUpdates: true,
      securityAlerts: true,
    },
    privacy: {
      profileVisibility: "public",
      showOnlineStatus: true,
      allowMessages: true,
      dataCollection: true,
      searchIndexing: true,
      twoFactorAuth: false,
    },
    language: {
      interfaceLanguage: "ar",
      dateFormat: "dd/MM/yyyy",
      timeFormat: "12h",
      timezone: "Asia/Riyadh",
      currency: "SAR",
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largerText: false,
      screenReader: false,
      keyboardNavigation: true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [activeTab, setActiveTab] = useState("appearance");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await getSettings(user?.id);
      if (userSettings?.success) {
        setSettings((prev) => ({ ...prev, ...userSettings.data }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      showNotification("فشل في تحميل الإعدادات", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateSettings(user?.id, settings);
      if (result.success) {
        updateTheme(settings.appearance);
        showNotification("تم حفظ الإعدادات بنجاح");
      } else {
        showNotification(result.error || "فشل في حفظ الإعدادات", "error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showNotification("حدث خطأ أثناء حفظ الإعدادات", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm("هل تريد إعادة تعيين جميع الإعدادات؟");
    if (!confirmed) return;

    try {
      const result = await resetSettings(user?.id);
      if (result.success) {
        setSettings(result.data);
        updateTheme(result.data.appearance);
        showNotification("تمت إعادة تعيين الإعدادات");
      } else {
        showNotification(result.error || "فشل في إعادة التعيين", "error");
      }
    } catch (error) {
      console.error("Error resetting settings:", error);
      showNotification("حدث خطأ أثناء إعادة التعيين", "error");
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `settings_backup_${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification("تم تصدير الإعدادات بنجاح");
    } catch (error) {
      console.error("Error exporting settings:", error);
      showNotification("فشل في التصدير", "error");
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setSettings(imported);
        showNotification("تم استيراد الإعدادات بنجاح");
      } catch (err) {
        showNotification("ملف غير صالح", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="جاري تحميل الإعدادات..." />
      </div>
    );
  }

  const tabs = [
    { id: "appearance", label: "المظهر", icon: "🎨" },
    { id: "notifications", label: "الإشعارات", icon: "🔔" },
    { id: "privacy", label: "الخصوصية", icon: "🔒" },
    { id: "language", label: "اللغة", icon: "🌐" },
    { id: "accessibility", label: "إمكانية الوصول", icon: "♿" },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* إشعارات */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ show: false, message: "", type: "" })
          }
        />
      )}

      {/* رأس الصفحة */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            الإعدادات
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            تخصيص المنصة حسب تفضيلاتك
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn btn-secondary">
            📤 تصدير
          </button>
          <label className="btn btn-secondary cursor-pointer">
            📥 استيراد
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button onClick={handleReset} className="btn btn-secondary">
            🔄 إعادة تعيين
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? <LoadingSpinner size="small" /> : "💾 حفظ"}
          </button>
        </div>
      </div>

      {/* ألسنة التبويب */}
      <div className="flex gap-2 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* محتوى التبويب */}
      <div className="settings-content">
        {/* 👇 ضع هنا نفس الأقسام كما كتبتها */}
      </div>
    </div>
  );
};

export default Settings;
