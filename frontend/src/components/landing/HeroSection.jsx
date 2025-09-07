import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const HeroSection = ({ lang = "ar" }) => {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechLang, setSpeechLang] = useState(
    lang === "ar" ? "ar-SA" : "en-US"
  );
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    setupRecognition();
  }, []);

  useEffect(() => {
    setupRecognition();
  }, [speechLang]);

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const setupRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "أنت مساعد قانوني ذكي للمنصات الفلسطينية.",
            },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: userMessage.text },
          ],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const aiText = response.data.choices[0].message.content;
      const aiMessage = { sender: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);

      speak(aiText);
    } catch (error) {
      console.error("AI API Error:", error);
      const fallbackMessage = {
        sender: "ai",
        text: "عذرًا، لم أتمكن من معالجة طلبك الآن.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      speak(fallbackMessage.text);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chatMessages");
  };

  const handleExportPDF = () => {
    if (messages.length === 0) return;
    const doc = new jsPDF({ orientation: "portrait" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    messages.forEach((msg, idx) => {
      const prefix =
        msg.sender === "user"
          ? lang === "ar"
            ? "المستخدم: "
            : "User: "
          : lang === "ar"
          ? "المساعد: "
          : "Assistant: ";
      doc.text(`${prefix}${msg.text}`, 10, 10 + idx * 10);
    });

    doc.save("chat_history.pdf");
  };

  const toggleRecording = () => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
      } else {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    } else {
      alert("التعرف على الصوت غير مدعوم في هذا المتصفح.");
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechLang = () => {
    setSpeechLang((prev) => (prev === "ar-SA" ? "en-US" : "ar-SA"));
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-20 px-6">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {lang === "ar" ? (
            <>
              منصة <span className="text-yellow-300">عدالة AI</span>
            </>
          ) : (
            <>Adala AI Platform</>
          )}
        </h1>

        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
          {lang === "ar"
            ? "أول منصة عربية تعتمد على الذكاء الاصطناعي والواقع الافتراضي لتقديم الاستشارات القانونية."
            : "The first Arabic platform leveraging AI and VR to provide legal consultations."}
        </p>

        {/* زر الاستشارة الذكية فوق الإحصاءات */}
        <button
          onClick={() => setChatVisible(!chatVisible)}
          className="mb-10 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          {lang === "ar" ? "ابدأ الاستشارة الذكية" : "Start Smart Consultation"}
        </button>

        {/* الإحصاءات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">1000+</div>
            <p className="text-sm">
              {lang === "ar" ? "قضية معالجة" : "Cases Processed"}
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">99%</div>
            <p className="text-sm">
              {lang === "ar" ? "دقة في التحليل" : "Analysis Accuracy"}
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-yellow-300 mb-2">24/7</div>
            <p className="text-sm">
              {lang === "ar" ? "دعم متواصل" : "Continuous Support"}
            </p>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      {chatVisible && (
        <div className="fixed bottom-6 right-6 md:right-12 w-80 md:w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-blue-700 text-white px-4 py-2 font-bold flex justify-between items-center">
            <span>
              {lang === "ar"
                ? "المساعد القانوني الذكي"
                : "Smart Legal Assistant"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="px-2 py-1 bg-green-600 rounded hover:bg-green-700 text-sm"
              >
                {lang === "ar" ? "تصدير PDF" : "Export PDF"}
              </button>
              <button
                onClick={handleClearChat}
                className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
              >
                {lang === "ar" ? "مسح الدردشة" : "Clear Chat"}
              </button>
              <button onClick={() => setChatVisible(false)}>✕</button>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] break-words ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-black"
                    : "bg-gray-100 self-start text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 flex gap-2 border-t border-gray-200"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder={
                lang === "ar" ? "اكتب استفسارك هنا..." : "Type your query..."
              }
            />
            <button
              type="button"
              onClick={toggleRecording}
              className={`px-3 py-2 rounded-lg ${
                isRecording ? "bg-red-500" : "bg-gray-400"
              } text-white`}
            >
              🎤
            </button>
            <button
              type="button"
              onClick={toggleSpeechLang}
              className="px-3 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
            >
              {speechLang === "ar-SA" ? "🇸🇦" : "🇺🇸"}
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              {lang === "ar" ? "إرسال" : "Send"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
