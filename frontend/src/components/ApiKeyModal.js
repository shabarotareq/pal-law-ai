// src/components/ApiKeyModal.js
import React, { useState, useEffect } from "react";
import { getAIInstance } from "../ai/AICharacter";

const ApiKeyModal = ({ isOpen, onClose, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // تحميل المفتاح المحفوظ عند فتح المودال
    if (isOpen) {
      const savedKey = localStorage.getItem("openai_api_key");
      if (savedKey) {
        setApiKey(savedKey);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      setError("يرجى إدخال مفتاح API صحيح");
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      setError("مفتاح API يجب أن يبدأ بـ sk-");
      return;
    }

    const aiService = getAIInstance();
    const success = aiService.setApiKey(apiKey);

    if (success) {
      setSuccess("تم حفظ مفتاح API بنجاح!");
      setError("");
      localStorage.setItem("openai_api_key", apiKey);

      // إغلاق المودال بعد ثانيتين
      setTimeout(() => {
        setSuccess("");
        onClose();
        if (onApiKeySet) onApiKeySet();
      }, 2000);
    } else {
      setError("مفتاح API غير صحيح");
      setSuccess("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          إعداد مفتاح OpenAI API
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              مفتاح OpenAI API
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل مفتاح API الذي يبدأ بـ sk-..."
              autoComplete="off"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mt-2">{success}</p>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex-1 hover:bg-gray-400 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-blue-600 transition"
            >
              حفظ المفتاح
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            كيفية الحصول على المفتاح:
          </h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>
              اذهب إلى{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                OpenAPI API Keys
              </a>
            </li>
            <li>سجل الدخول أو أنشئ حساب جديد</li>
            <li>انقر على "Create new secret key"</li>
            <li>انسخ المفتاح وألصقه هنا</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">ملاحظة مهمة:</h3>
          <p className="text-sm text-yellow-700">
            المفتاح يخزن محلياً في متصفحك فقط ولن يتم إرساله إلى أي خادم آخر.
            استخدم مفتاحاً من حسابك الشخصي.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
