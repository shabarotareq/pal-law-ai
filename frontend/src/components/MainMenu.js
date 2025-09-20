"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function MainMenu() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [servers, setServers] = useState([
    {
      server: "خادم 1",
      session: "9:00",
      persons: "القاضي، المحامي",
      map: "مركز المدينة",
      delay: 0,
    },
    {
      server: "خادم 2",
      session: "9:30",
      persons: "شاهد، محامي",
      map: "الفرعية",
      delay: 2,
    },
  ]);
  const [colleagues, setColleagues] = useState(["أحمد", "سارة"]);
  const [newColleague, setNewColleague] = useState("");
  const router = useRouter();

  const getDelayColor = (delay) => {
    if (delay === 0) return "bg-green-600";
    if (delay <= 2) return "bg-yellow-500";
    return "bg-red-600";
  };

  const handleButtonAction = (btn) => {
    switch (btn) {
      case "اتصال":
        alert("✅ تم الاتصال بالخادم!");
        break;
      case "تحديث":
      case "تحديث سريع":
      case "تحديث الكل":
        alert("🔄 تم تحديث بيانات الخوادم");
        break;
      case "إضافة خادم":
        setServers([
          ...servers,
          {
            server: `خادم ${servers.length + 1}`,
            session: "10:00",
            persons: "محامي، شاهد",
            map: "جديد",
            delay: Math.floor(Math.random() * 3),
          },
        ]);
        alert("➕ تم إضافة خادم جديد");
        break;
      case "تغيير التصفيات":
        alert("⚙️ نافذة تغيير التصفيات (محاكاة)");
        break;
      default:
        alert(`⚠️ الزر "${btn}" غير معرف بعد`);
    }
  };

  const tabs = [
    {
      title: "الانترنت",
      content: (
        <table className="w-full text-white border border-white/40">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-white/40">الخوادم</th>
              <th className="p-2 border border-white/40">الجلسة</th>
              <th className="p-2 border border-white/40">الشخوص</th>
              <th className="p-2 border border-white/40">الخريطة</th>
              <th className="p-2 border border-white/40">التأخير</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-white/40">{row.server}</td>
                <td className="p-2 border border-white/40">{row.session}</td>
                <td className="p-2 border border-white/40">{row.persons}</td>
                <td className="p-2 border border-white/40">{row.map}</td>
                <td
                  className={`p-2 border border-white/40 text-center ${getDelayColor(
                    row.delay
                  )}`}
                >
                  {row.delay} ثانية
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      buttons: ["تغيير التصفيات", "تحديث سريع", "تحديث الكل", "اتصال"],
    },
    {
      title: "المفضلة",
      content: (
        <div className="text-white text-center py-6">
          ⭐ هنا ستظهر الخوادم المفضلة لديك
        </div>
      ),
      buttons: ["إضافة خادم", "تحديث", "اتصال"],
    },
    {
      title: "التاريخ",
      content: (
        <div className="text-white text-center py-6">
          🕘 سجل الجلسات السابقة
        </div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "المعاينة",
      content: (
        <div className="text-white text-center py-6">محتوى المعاينة هنا...</div>
      ),
      buttons: ["تغيير التصفيات", "تحديث الكل", "اتصال"],
    },
    {
      title: "شبكة محلية",
      content: (
        <div className="text-white text-center py-6">
          محتوى الشبكة المحلية هنا...
        </div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "الزملاء",
      content: (
        <div className="text-white space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newColleague}
              onChange={(e) => setNewColleague(e.target.value)}
              placeholder="أدخل اسم الزميل"
              className="p-2 rounded text-black flex-1"
            />
            <button
              onClick={() => {
                if (newColleague.trim()) {
                  setColleagues([...colleagues, newColleague.trim()]);
                  setNewColleague("");
                }
              }}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              ➕ إضافة
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {colleagues.map((col, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-white/10 p-2 rounded"
              >
                {col}
                <button
                  onClick={() =>
                    setColleagues(colleagues.filter((c) => c !== col))
                  }
                  className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 transition text-white"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 p-4">
      <h1 className="text-4xl font-bold mb-8">🏛️ المحكمة الافتراضية</h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => setShowOverlay(true)}
          className="w-full px-6 py-3 bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          🛰️ اكتشف الخوادم
        </button>

        <button
          onClick={() =>
            router.push({
              pathname: "./Virtualcourt.jsx",
              query: { colleagues: colleagues.join(",") },
            })
          }
          className="w-full px-6 py-3 bg-pink-500 rounded-xl shadow-lg hover:bg-pink-600 transition"
        >
          🎥 دخول المحكمة
        </button>

        <button
          onClick={() => alert("🚀 إنشاء خادم قريبًا")}
          className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-300 transition"
        >
          🚀 أنشئ خادم جديد
        </button>

        <button
          onClick={() => alert("👥 الزملاء قريبًا")}
          className="w-full px-6 py-3 bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700 transition"
        >
          👥 الزملاء
        </button>

        <button
          onClick={() => alert("⚙️ الخيارات قريبًا")}
          className="w-full px-6 py-3 bg-gray-600 rounded-xl shadow-lg hover:bg-gray-700 transition"
        >
          ⚙️ الخيارات
        </button>

        <button
          onClick={() => window.history.back()}
          className="w-full px-6 py-3 bg-red-600 rounded-xl shadow-lg hover:bg-red-700 transition"
        >
          ⬅️ العودة
        </button>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-[900px] max-w-[95%] h-[500px] bg-gray-900 rounded-xl shadow-2xl text-white flex flex-col relative border border-white/30">
            <h2 className="text-2xl font-bold mb-4 text-center mt-4">
              🛰️ الخوادم المتوفرة
            </h2>

            <div className="flex justify-start px-4 gap-2 mb-0">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 py-2 font-semibold transition-all duration-300 ${
                    activeTab === index
                      ? "bg-yellow-400 text-black shadow-md rounded-t-xl"
                      : "bg-white/20 text-white hover:bg-white/30 rounded-t-xl"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-white/10 text-white rounded-b-xl mx-4 mt-0 rounded-t-none">
              {tabs[activeTab].content}
            </div>

            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-3">
              {tabs[activeTab].buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleButtonAction(btn)}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-white shadow"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowOverlay(false)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
