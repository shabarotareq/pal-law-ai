import React from "react";

function LaborLaw() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">قانون العمل الفلسطيني</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded bg-white shadow">
          <h2 className="font-semibold">
            الباب الأول: التعاريف والأحكام العامة
          </h2>
          <ul className="list-disc list-inside mt-2">
            <li>الفصل الأول: التعاريف</li>
            <li>الفصل الثاني: نطاق التطبيق</li>
            <li>الفصل الثالث: الحقوق والواجبات</li>
          </ul>
        </div>

        <div className="p-4 border rounded bg-white shadow">
          <h2 className="font-semibold">الباب الثاني: عقود العمل</h2>
          <ul className="list-disc list-inside mt-2">
            <li>الفصل الأول: إبرام العقد</li>
            <li>الفصل الثاني: إنهاء العقد</li>
            <li>الفصل الثالث: الأجور</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LaborLaw;
