import { Routes, Route, Link } from "react-router-dom";

export default function PenalCode() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">قانون العقوبات</h2>
      <ul className="list-disc pl-5">
        <li>
          <Link to="part-1">الباب الأول: أحكام عامة</Link>
        </li>
        <li>
          <Link to="part-2">الباب الثاني: الجرائم والعقوبات</Link>
        </li>
      </ul>

      <Routes>
        <Route path="part-1" element={<Part1 />} />
        <Route path="part-2" element={<Part2 />} />
      </Routes>
    </div>
  );
}

function Part1() {
  return (
    <div>
      <h3 className="font-semibold">الباب الأول: أحكام عامة</h3>
      <ul>
        <li>
          <Link to="chapter-1">الفصل الأول: التعريفات</Link>
        </li>
        <li>
          <Link to="chapter-2">الفصل الثاني: نطاق التطبيق</Link>
        </li>
      </ul>

      <Routes>
        <Route path="chapter-1" element={<div>المادة 1 - المادة 5</div>} />
        <Route path="chapter-2" element={<div>المادة 6 - المادة 12</div>} />
      </Routes>
    </div>
  );
}

function Part2() {
  return (
    <div>
      <h3 className="font-semibold">الباب الثاني: الجرائم والعقوبات</h3>
      <ul>
        <li>
          <Link to="chapter-1">الفصل الأول: الجرائم ضد الدولة</Link>
        </li>
        <li>
          <Link to="chapter-2">الفصل الثاني: الجرائم ضد الأفراد</Link>
        </li>
      </ul>
    </div>
  );
}
