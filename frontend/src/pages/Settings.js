// src/pages/Settings.js
import React, { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    language: "ar",
    theme: "light",
  });

  const handleChange = (e) =>
    setSettings({ ...settings, [e.target.name]: e.target.value });

  const handleSave = () => {
    alert("تم حفظ الإعدادات!");
    console.log(settings);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">الإعدادات</h2>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">اللغة:</label>
          <select
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">المظهر:</label>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
}
