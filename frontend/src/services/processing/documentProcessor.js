import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // نسخة ثابتة للعمل على Node

// تهيئة pdfjs لاستخدام worker محلي
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`; // ضع pdf.worker.min.js في public/

// معالجة الملفات حسب النوع
export const processDocument = async (file, type) => {
  try {
    switch (type) {
      case "pdf":
        return await extractTextFromPDF(file);
      case "docx":
        return await extractTextFromDOCX(file);
      case "txt":
        return await extractTextFromTXT(file);
      default:
        throw new Error("نوع الملف غير مدعوم");
    }
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error(`فشل في معالجة الملف: ${error.message}`);
  }
};

// استخراج النص من PDF
const extractTextFromPDF = async (file) => {
  if (!file?.arrayBuffer) throw new Error("ملف PDF غير صالح");
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return {
    text: fullText,
    metadata: {
      pageCount: pdf.numPages,
      processedAt: new Date().toISOString(),
    },
  };
};

// استخراج النص من DOCX
const extractTextFromDOCX = async (file) => {
  if (!file?.arrayBuffer) throw new Error("ملف DOCX غير صالح");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  return {
    text: result.value,
    metadata: {
      processedAt: new Date().toISOString(),
      warnings: result.messages,
    },
  };
};

// استخراج النص من TXT
const extractTextFromTXT = async (file) => {
  if (!file?.text) throw new Error("ملف TXT غير صالح");
  const text = await file.text();
  return {
    text,
    metadata: {
      processedAt: new Date().toISOString(),
    },
  };
};

// تقسيم النص إلى أجزاء للبحث
export const chunkTextForSearch = (text, chunkSize = 1000) => {
  const chunks = [];
  const words = text.split(/\s+/);

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push({
      text: chunk,
      startIndex: i,
      endIndex: Math.min(i + chunkSize, words.length),
    });
  }

  return chunks;
};

// البحث في النص المحلي
export const searchInDocument = (text, query) => {
  if (!query) return [];
  // هروب الرموز الخاصة في query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "gi");

  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const start = Math.max(0, match.index - 100);
    const end = Math.min(text.length, match.index + match[0].length + 100);
    const context = text.substring(start, end);

    matches.push({
      match: match[0],
      context,
      position: match.index,
    });
  }

  return matches;
};
