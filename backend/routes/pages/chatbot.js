import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ضع مفتاح API هنا
});

const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // أو أي موديل مدعوم
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد قانوني ذكي تجيب على استفسارات قانونية للمستخدمين بلغة مبسطة.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "⚠️ عذراً، حدث خطأ أثناء معالجة الطلب." });
  }
}

