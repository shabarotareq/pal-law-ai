import React, { useState, useEffect } from "react";
import DocumentUploader from "./DocumentUploader";
import { legalKnowledgeApi } from "../services/api";

const LegalKnowledgeManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await legalKnowledgeApi.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentProcessed = (document) => {
    setDocuments((prev) => [document, ...prev]);
  };

  const deleteDocument = async (docId) => {
    try {
      await legalKnowledgeApi.deleteDocument(docId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="legal-knowledge-manager">
      <h2>إدارة المعرفة القانونية</h2>

      <DocumentUploader onDocumentProcessed={handleDocumentProcessed} />

      <div className="documents-list">
        <h3>المستندات المرفوعة ({documents.length})</h3>

        {loading ? (
          <p>جاري تحميل المستندات...</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-info">
                <h4>{doc.metadata.originalName}</h4>
                <p>التصنيف: {doc.metadata.category}</p>
                <p>عدد الكلمات: {doc.metadata.wordCount}</p>
                <p>
                  تاريخ الرفع:{" "}
                  {new Date(doc.metadata.uploadDate).toLocaleDateString(
                    "ar-SA"
                  )}
                </p>
              </div>

              <div className="document-actions">
                <button onClick={() => deleteDocument(doc.id)}>حذف</button>
                <button onClick={() => console.log("View document:", doc)}>
                  عرض
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LegalKnowledgeManager;
