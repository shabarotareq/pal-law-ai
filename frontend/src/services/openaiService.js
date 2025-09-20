import axios from "axios";

// تأكد من وضع المفتاح في ملف .env
// REACT_APP_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn(
    "⚠️ OpenAI API key is not set in environment variables. Add REACT_APP_OPENAI_API_KEY to your .env file"
  );
}

/**
 * استدعاء OpenAI GPT-4
 * @param {Array} messages - مصفوفة الرسائل (role, content)
 * @returns {Promise<string>} رد النموذج
 */
export const callOpenAI = async (messages) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // نعيد الرد الأول من النموذج
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    throw new Error("فشل الاتصال بـ OpenAI API");
  }
};
