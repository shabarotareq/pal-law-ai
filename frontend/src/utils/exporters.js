import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportCasesToExcel = (rows, filename = "cases.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cases");
  XLSX.writeFile(wb, filename);
};

export const exportCasesToPDF = (rows, filename = "cases.pdf") => {
  const doc = new jsPDF();
  const columns = [
    { header: "العنوان", dataKey: "title" },
    { header: "النوع", dataKey: "lawType" },
    { header: "الوصف", dataKey: "description" },
    { header: "تاريخ الإنشاء", dataKey: "createdAt" },
  ];
  const tableRows = rows.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toLocaleString(),
  }));
  doc.text("تقرير القضايا", 14, 14);
  doc.autoTable({
    head: [columns.map((c) => c.header)],
    body: tableRows.map((r) => columns.map((c) => r[c.dataKey] ?? "")),
    startY: 20,
  });
  doc.save(filename);
};
