// import gzipSize from "gzip-size";

export default async function handler(req, res) {
  // السماح فقط لطلبات POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const { content } = req.body;

    // التحقق من وجود المحتوى
    if (!content) {
      return res.status(400).json({
        error: "Content is required",
      });
    }

    // حساب حجم Gzip (يعمل على الخادم فقط)
    // const size = gzipSize.sync(content);

    // بديل بسيط لحساب الحجم
    const size = new TextEncoder().encode(content).length;
    const estimatedGzipSize = Math.round(size * 0.7); // تقدير حجم Gzip

    // إرجاع النتيجة
    res.status(200).json({
      success: true,
      size: estimatedGzipSize,
      originalSize: size,
      contentLength: content.length,
      compressionRatio: (content.length / estimatedGzipSize).toFixed(2),
      message: "وظيفة Gzip التقريبية (الحزمة غير مثبتة)",
    });
  } catch (error) {
    console.error("Gzip API Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}

// إعدادات API
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // زيادة حجم البيانات المسموح به
    },
  },
};
