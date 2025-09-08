import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          حدث خطأ غير متوقع
        </h2>
        <p className="text-gray-600 mb-4">
          نعتذر عن هذا الإزعاج. يرجى تحديث الصفحة أو المحاولة لاحقاً.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          تحديث الصفحة
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
