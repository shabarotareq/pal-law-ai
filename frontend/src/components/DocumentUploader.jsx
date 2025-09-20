import React, { useState } from "react";
import { documentProcessor } from "../services/documentProcessor";

const DocumentUploader = ({ onDocumentProcessed }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setUploading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // قراءة الملف كـ buffer
        const buffer = await readFileAsBuffer(file);

        // معالجة المستند
        const processedDoc = await documentProcessor.processUploadedDocument(
          {
            originalname: file.name,
            buffer: buffer,
          },
          "law", // التصنيف
          {
            source: "user_upload",
            uploader: "user_id_here",
          }
        );

        setProgress(((i + 1) / files.length) * 100);
        onDocumentProcessed(processedDoc);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      }
    }

    setUploading(false);
  };

  const readFileAsBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="document-uploader">
      <input
        type="file"
        accept=".pdf,.docx,.doc"
        multiple
        onChange={handleFileUpload}
        disabled={uploading}
        style={{ display: "none" }}
        id="document-upload"
      />

      <label htmlFor="document-upload" className="upload-button">
        {uploading ? "جاري المعالجة..." : "رفع مستندات قانونية"}
      </label>

      {uploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      <div className="upload-info">
        <p>📁支持的格式: PDF, DOCX, DOC</p>
        <p>⚖️ يمكن رفع القوانين، الأحكام، الإجراءات</p>
        <p>🔍 سيتم معالجة المحتوى تلقائياً للبحث</p>
      </div>
    </div>
  );
};

export default DocumentUploader;
