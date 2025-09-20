import React, { useState } from "react";
import { callOpenAI } from "../services/openaiService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const SmartChat = ({ lang = "ar" }) => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        lang === "ar"
          ? "أنت مساعد قانوني ذكي."
          : "You are a smart legal assistant.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await callOpenAI(newMessages);
      const reply = response.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ حدث خطأ أثناء جلب الرد." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {lang === "ar" ? "المحادثة الذكية" : "Smart Legal Chat"}
      </h2>

      <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
        {messages.slice(1).map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-green-100 text-left"
            }`}
          >
            <strong>
              {msg.role === "user"
                ? lang === "ar"
                  ? "المستخدم"
                  : "User"
                : lang === "ar"
                ? "المساعد"
                : "Assistant"}
              :{" "}
            </strong>
            {msg.content}
          </div>
        ))}
        {loading && (
          <LoadingSpinner
            size="small"
            text={lang === "ar" ? "جاري التفكير..." : "Thinking..."}
          />
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            lang === "ar"
              ? "اكتب استفسارك القانوني..."
              : "Type your legal question..."
          }
          className="flex-grow border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {lang === "ar" ? "إرسال" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default SmartChat;
