// frontend/components/HUD.js
import React from "react";

export default function HUD({ caseFile, onSave, onShow }) {
  if (!caseFile?.caseNumber) return null;

  return (
    <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-xl shadow-lg space-y-2 z-50">
      <h2 className="font-bold">⚖️ ملف القضية</h2>
      <p>
        المحكمة: {caseFile.court} {caseFile.subCourt || ""}
      </p>
      <p>المدينة: {caseFile.city}</p>
      <p>رقم القضية: {caseFile.caseNumber}</p>
      <p>رقم الجلسة: {caseFile.sessionNumber}</p>
      <div className="flex gap-2">
        <button
          onClick={onShow}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          عرض
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
        >
          حفظ PDF
        </button>
      </div>
    </div>
  );
}
