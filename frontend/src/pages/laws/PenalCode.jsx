import { useState } from "react";
import Link from "next/link";

export default function PenalCode() {
  const [section, setSection] = useState(null);
  const [chapter, setChapter] = useState(null);

  return (
    <div className="mt-6 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">قانون العقوبات</h2>

      {!section && (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <button
              onClick={() => setSection("part-1")}
              className="text-blue-600 hover:underline"
            >
              الباب الأول: أحكام عامة
            </button>
          </li>
          <li>
            <button
              onClick={() => setSection("part-2")}
              className="text-blue-600 hover:underline"
            >
              الباب الثاني: الجرائم والعقوبات
            </button>
          </li>
        </ul>
      )}

      {section === "part-1" && (
        <Part1 chapter={chapter} setChapter={setChapter} />
      )}
      {section === "part-2" && <Part2 />}
    </div>
  );
}

function Part1({ chapter, setChapter }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg mb-2">الباب الأول: أحكام عامة</h3>
      {!chapter && (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <button
              onClick={() => setChapter("chapter-1")}
              className="text-blue-600 hover:underline"
            >
              الفصل الأول: التعريفات
            </button>
          </li>
          <li>
            <button
              onClick={() => setChapter("chapter-2")}
              className="text-blue-600 hover:underline"
            >
              الفصل الثاني: نطاق التطبيق
            </button>
          </li>
        </ul>
      )}

      {chapter === "chapter-1" && (
        <div className="mt-3 p-3 border rounded bg-gray-50">
          <h4 className="font-semibold">الفصل الأول: التعريفات</h4>
          <p>المادة 1 - المادة 5</p>
        </div>
      )}

      {chapter === "chapter-2" && (
        <div className="mt-3 p-3 border rounded bg-gray-50">
          <h4 className="font-semibold">الفصل الثاني: نطاق التطبيق</h4>
          <p>المادة 6 - المادة 12</p>
        </div>
      )}
    </div>
  );
}

function Part2() {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-lg mb-2">
        الباب الثاني: الجرائم والعقوبات
      </h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <span className="text-blue-600">الفصل الأول: الجرائم ضد الدولة</span>
        </li>
        <li>
          <span className="text-blue-600">
            الفصل الثاني: الجرائم ضد الأفراد
          </span>
        </li>
      </ul>
    </div>
  );
}
