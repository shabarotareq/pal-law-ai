// frontend/components/SessionSettings.js
import React, { useState } from "react";
import jsPDF from "jspdf";

export default function SessionSettings({ onBack, onEnter, language = "ar" }) {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [courtMain, setCourtMain] = useState("");
  const [courtSub, setCourtSub] = useState("");
  const [city, setCity] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [saveFile, setSaveFile] = useState(false);

  const labels =
    language === "en"
      ? {
          selectCharacter: "Select your character",
          enterName: "Enter your name",
          chooseCourt: "Choose court",
          enterCity: "City",
          caseNo: "Case number",
          sessionNo: "Session number",
          date: "Date",
          time: "Time",
          startSession: "Enter Court",
          saveFile: "Save case file",
          viewFile: "View case file",
          back: "Back",
        }
      : {
          selectCharacter: "اختر شخصيتك",
          enterName: "ادخل الاسم",
          chooseCourt: "اختر المحكمة",
          enterCity: "اسم المدينة",
          caseNo: "رقم القضية",
          sessionNo: "رقم الجلسة",
          date: "تاريخ الجلسة",
          time: "ساعة الانعقاد",
          startSession: "دخول الجلسة",
          saveFile: "حفظ ملف القضية",
          viewFile: "عرض ملف القضية",
          back: "عودة",
        };

  const handleStart = () => {
    if (
      !role ||
      !name ||
      !courtMain ||
      (courtMain === "صلح" && !courtSub) ||
      !city ||
      !caseNumber ||
      !sessionNumber ||
      !sessionDate ||
      !sessionTime
    ) {
      alert(
        language === "en"
          ? "Please fill all required fields"
          : "الرجاء تعبئة جميع الحقول المطلوبة"
      );
      return;
    }

    // إنشاء بيانات الجلسة
    const sessionData = {
      role,
      name,
      courtMain,
      courtSub,
      city,
      caseNumber,
      sessionNumber,
      sessionDate,
      sessionTime,
    };

    // حفظ PDF إذا تم اختيار ذلك
    if (saveFile) handleSavePDF(sessionData);

    // تمرير البيانات إلى الصفحة الرئيسية لبدء المحكمة الافتراضية
    onEnter(sessionData);
  };

  const handleSavePDF = (data) => {
    const doc = new jsPDF();
    doc.text(`Case File: ${data.caseNumber}`, 10, 10);
    doc.text(`Court: ${data.courtMain} ${data.courtSub || ""}`, 10, 20);
    doc.text(`City: ${data.city}`, 10, 30);
    doc.text(`Role: ${data.role}`, 10, 40);
    doc.text(`Name: ${data.name}`, 10, 50);
    doc.save(`Case_${data.caseNumber}.pdf`);
  };

  const handleShowCaseFile = () => {
    alert(
      JSON.stringify(
        {
          role,
          name,
          courtMain,
          courtSub,
          city,
          caseNumber,
          sessionNumber,
          sessionDate,
          sessionTime,
        },
        null,
        2
      )
    );
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-r from-blue-400 to-blue-700 rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-300 text-gray-900">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          ⚖️ {language === "en" ? "Virtual Court" : "المحكمة الافتراضية"}
        </h1>
        <p className="text-white text-sm">
          {language === "en"
            ? "Interactive platform to simulate court sessions"
            : "منصة تفاعلية لمحاكاة جلسات المحكمة"}
        </p>

        <h2 className="text-lg font-semibold text-white">
          {labels.selectCharacter}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {["القاضي", "المحامي", "الشاهد"].map((roleOption) => (
            <button
              key={roleOption}
              onClick={() => setRole(roleOption)}
              className={`p-3 rounded-lg text-white font-medium ${
                role === roleOption
                  ? "bg-blue-900"
                  : "bg-gradient-to-r from-blue-500 to-blue-700"
              }`}
            >
              {language === "en"
                ? roleOption === "القاضي"
                  ? "Judge"
                  : roleOption === "المحامي"
                  ? "Lawyer"
                  : "Witness"
                : roleOption}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder={`${labels.enterName} ${role || ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded text-gray-900 placeholder:text-gray-700"
        />

        <select
          value={courtMain}
          onChange={(e) => {
            setCourtMain(e.target.value);
            setCourtSub("");
          }}
          className="w-full p-2 rounded text-gray-900"
        >
          <option value="">{labels.chooseCourt}</option>
          <option value="صلح">
            {language === "en" ? "Conciliation Court" : "محكمة الصلح"}
          </option>
          <option value="شرعية">
            {language === "en" ? "Sharia Court" : "المحكمة الشرعية"}
          </option>
          <option value="عليا">
            {language === "en" ? "Supreme Court" : "المحكمة العليا"}
          </option>
        </select>

        {courtMain === "صلح" && (
          <select
            value={courtSub}
            onChange={(e) => setCourtSub(e.target.value)}
            className="w-full p-2 rounded text-gray-900"
          >
            <option value="">
              {language === "en" ? "Select branch" : "اختر الفرع"}
            </option>
            <option value="بداية">
              {language === "en" ? "First Instance" : "محكمة البداية"}
            </option>
            <option value="استئناف">
              {language === "en" ? "Appeal" : "محكمة الاستئناف"}
            </option>
            <option value="نقض">
              {language === "en" ? "Cassation" : "محكمة النقض"}
            </option>
          </select>
        )}

        <input
          type="text"
          placeholder={labels.enterCity}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 rounded text-gray-900"
        />
        <input
          type="text"
          placeholder={labels.caseNo}
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          className="w-full p-2 rounded text-gray-900"
        />
        <input
          type="text"
          placeholder={labels.sessionNo}
          value={sessionNumber}
          onChange={(e) => setSessionNumber(e.target.value)}
          className="w-full p-2 rounded text-gray-900"
        />
        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="w-full p-2 rounded text-gray-900"
        />
        <input
          type="time"
          value={sessionTime}
          onChange={(e) => setSessionTime(e.target.value)}
          className="w-full p-2 rounded text-gray-900"
        />

        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={saveFile}
            onChange={() => setSaveFile(!saveFile)}
          />{" "}
          {labels.saveFile}
        </label>

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleStart}
            className="flex-1 py-2 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
          >
            {labels.startSession}
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600 transition"
          >
            {labels.back}
          </button>
        </div>

        {saveFile && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleShowCaseFile}
              className="py-1 px-2 bg-green-600 text-white rounded"
            >
              {labels.viewFile}
            </button>
            <button
              onClick={() =>
                handleSavePDF({
                  role,
                  name,
                  courtMain,
                  courtSub,
                  city,
                  caseNumber,
                  sessionNumber,
                  sessionDate,
                  sessionTime,
                })
              }
              className="py-1 px-2 bg-green-800 text-white rounded"
            >
              PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
