import React, { useState } from "react";
import { callOpenAI } from "../../services/openaiService";
import "./LegalChatBot.css";

const LegalChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await callOpenAI(updatedMessages);
      const botReply = response.choices[0].message;
      setMessages([...updatedMessages, botReply]);
    } catch (error) {
      console.error("AI API Error:", error);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "حدث خطأ في الاتصال بالذكاء الاصطناعي." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="legal-chatbot">
      <h2>المحادثة الذكية</h2>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <p className="loading">جاري الرد...</p>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك القانوني..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          إرسال
        </button>
      </div>
    </div>
  );
};

export default LegalChatBot;
