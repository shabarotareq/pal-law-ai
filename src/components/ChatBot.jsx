import React, { useState } from "react";
import { sendMessage } from "../services/api";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      text: "مرحباً! أنا مساعدك القانوني الذكي. كيف يمكنني مساعدتك اليوم؟",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      const botMessage = { text: response.answer, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        text: "عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">محادثة - اكتب استفسارك القانوني</div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? "user-message" : "bot-message"}`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            جاري البحث في المعلومات القانونية...
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اكتب استفسارك القانوني هنا..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          إرسال
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
