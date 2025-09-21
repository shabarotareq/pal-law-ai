"use client"; // ✅ مهم: لجعل الصفحة Client Component بسبب استخدام window

import Link from "next/link";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles["not-found-container"]}>
      <div className={styles["not-found-content"]}>
        <div className={styles["not-found-icon"]}>🔍</div>
        <h1>404 - الصفحة غير موجودة</h1>
        <p>عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <div className={styles["not-found-actions"]}>
          <Link href="/" className="btn btn-primary">
            العودة إلى الصفحة الرئيسية
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    </div>
  );
}
