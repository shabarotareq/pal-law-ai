// src/ai/AICharacter.js
import { OpenAI } from "openai";

class AICharacter {
  constructor() {
    // محاولة الحصول على مفتاح API من متغيرات البيئة أولاً
    const apiKey =
      process.env.REACT_APP_OPENAI_API_KEY ||
      localStorage.getItem(
        "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"
      );

    if (!apiKey) {
      console.warn("OpenAI API key is missing. AI features will be disabled.");
      this.openai = null;
      this.isAvailable = false;
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // فقط للتطوير
      });
      this.isAvailable = true;
    } catch (error) {
      console.error("Failed to initialize OpenAI:", error);
      this.openai = null;
      this.isAvailable = false;
    }
  }

  async generateResponse(prompt) {
    if (!this.isAvailable || !this.openai) {
      return this.getFallbackResponse();
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return this.getErrorResponse();
    }
  }

  getFallbackResponse() {
    const responses = [
      "⚠️ خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى التأكد من إعداد مفتاح API الصحيح.",
      "🔑 لم يتم تكوين مفتاح OpenAI API. يرجى إضافته في الإعدادات.",
      "🤖 تعذر الاتصال بخدمة الذكاء الاصطناعي. تأكد من صحة مفتاح API.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getErrorResponse() {
    const responses = [
      "❌ حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة لاحقاً.",
      "🔧 هناك مشكلة تقنية في خدمة الذكاء الاصطناعي. جاري العمل على إصلاحها.",
      "🌐 تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // دالة للتحقق من توفر خدمة الذكاء الاصطناعي
  checkAvailability() {
    return this.isAvailable;
  }

  // دالة لإعداد مفتاح API يدوياً
  setApiKey(apiKey) {
    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });
      this.isAvailable = true;
      localStorage.setItem("openai_api_key", apiKey);
      return true;
    } catch (error) {
      console.error("Failed to set API key:", error);
      this.isAvailable = false;
      return false;
    }
  }
}

// إنشاء نسخة واحدة فقط (Singleton)
let aiInstance = null;

// تصدير الدالة المساعدة كتصدير named
export const getAIInstance = () => {
  if (!aiInstance) {
    aiInstance = new AICharacter();
  }
  return aiInstance;
};

// تصدير AICharacter كتصدير افتراضي
export default AICharacter;
