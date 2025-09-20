// src/pages/ApiSettingsPage.js
import React, { useState, useEffect } from "react";
import ApiKeyModal from "../components/ApiKeyModal";

const ApiSettingsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("openai_api_key");
    setHasApiKey(!!key);
  }, []);

  const removeApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setHasApiKey(false);
    alert("تم حذف مفتاح API");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          إعدادات OpenAI API
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">حالة المفتاح:</h2>
          <div
            className={`p-4 rounded-lg ${
              hasApiKey
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {hasApiKey
              ? "✓ تم إعداد مفتاح API"
              : "⚠ لم يتم إعداد مفتاح API بعد"}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {hasApiKey ? "تغيير المفتاح" : "إضافة مفتاح"}
          </button>

          {hasApiKey && (
            <button
              onClick={removeApiKey}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              حذف المفتاح
            </button>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">معلومات مهمة:</h3>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-2">
            <li>المفتاح يخزن محلياً في متصفحك فقط</li>
            <li>استخدم مفتاحاً من حساب OpenAI الشخصي الخاص بك</li>
            <li>سيتم تطبيق التغييرات بعد إعادة تحميل الصفحة</li>
            <li>احتفظ بمفتاحك سرياً ولا تشاركه مع الآخرين</li>
          </ul>
        </div>
      </div>

      <ApiKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default ApiSettingsPage;
