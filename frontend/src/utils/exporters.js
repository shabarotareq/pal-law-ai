// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

export const exportCasesToExcel = (rows, filename = "cases.xlsx") => {
  console.log("تصدير Excel غير متاح حالياً - تحتاج إلى تثبيت حزمة xlsx");
  console.log("بيانات التصدير:", rows);

  // بديل بسيط: تصدير كـ CSV
  if (rows && rows.length > 0) {
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            if (typeof value === "string")
              return `"${value.replace(/"/g, '""')}"`;
            return String(value);
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename.replace(".xlsx", ".csv");
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }
};

export const exportCasesToPDF = (rows, filename = "cases.pdf") => {
  console.log(
    "تصدير PDF غير متاح حالياً - تحتاج إلى تثبيت حزمة jspdf و jspdf-autotable"
  );
  console.log("بيانات التصدير:", rows);

  // بديل بسيط: عرض البيانات في console
  if (rows && rows.length > 0) {
    console.table(rows);
    alert(
      `يتم تحضير تقرير PDF: ${filename}\n\nيمكنك مشاهدة البيانات في console للمطورين`
    );
  }
};

// بدائل إضافية للتصدير
export const exportCasesToJSON = (rows, filename = "cases.json") => {
  if (!rows || rows.length === 0) {
    console.warn("لا توجد بيانات للتصدير");
    return;
  }

  try {
    const jsonContent = JSON.stringify(rows, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  } catch (error) {
    console.error("خطأ في تصدير JSON:", error);
  }
};

export const exportCasesToCSV = (rows, filename = "cases.csv") => {
  if (!rows || rows.length === 0) {
    console.warn("لا توجد بيانات للتصدير");
    return;
  }

  try {
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            if (typeof value === "string")
              return `"${value.replace(/"/g, '""')}"`;
            return String(value);
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  } catch (error) {
    console.error("خطأ في تصدير CSV:", error);
  }
};

// دالة مساعدة للتحقق من توفر المتصفح
const isBrowser = typeof window !== "undefined";

// دالة تصدير عامة
export const exportCases = (rows, format, filename = "cases") => {
  if (!isBrowser) {
    console.warn("التصدير متاح فقط في المتصفح");
    return;
  }

  if (!rows || rows.length === 0) {
    console.warn("لا توجد بيانات للتصدير");
    return;
  }

  const validFilename =
    filename || `cases-${new Date().toISOString().split("T")[0]}`;

  switch (format) {
    case "excel":
      exportCasesToExcel(rows, `${validFilename}.xlsx`);
      break;
    case "pdf":
      exportCasesToPDF(rows, `${validFilename}.pdf`);
      break;
    case "csv":
      exportCasesToCSV(rows, `${validFilename}.csv`);
      break;
    case "json":
      exportCasesToJSON(rows, `${validFilename}.json`);
      break;
    default:
      console.warn(`صيغة التصدير غير معروفة: ${format}`);
      exportCasesToCSV(rows, `${validFilename}.csv`);
  }
};
