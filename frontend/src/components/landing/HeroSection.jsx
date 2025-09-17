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

  // استرجاع الرسائل المخزنة وإعداد التعرف على الصوت
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
      recognition.onresult = (event) =>
        setInput(event.results[0][0].transcript);
      recognition.onend = () => setIsRecording(false);
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
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
      speak(aiText);
    } catch (error) {
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
    if (!recognitionRef.current)
      return alert("التعرف على الصوت غير مدعوم في هذا المتصفح.");
    isRecording
      ? recognitionRef.current.stop()
      : recognitionRef.current.start();
    setIsRecording(!isRecording);
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechLang = () =>
    setSpeechLang((prev) => (prev === "ar-SA" ? "en-US" : "ar-SA"));

  return (
    <section
      id="hero-section"
      className="flex flex-col flex-1 items-center justify-center text-white py-10 px-6 relative overflow-hidden h-full"
      style={{
        backgroundImage: "url('/assets/court.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* طبقة شفافة */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>

      {/* المحتوى */}
      <div className="text-center max-w-4xl z-10 relative">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {lang === "ar" ? (
            <>
              منصة <span className="text-yellow-300">عدالة AI</span>
            </>
          ) : (
            "Adala AI Platform"
          )}
        </h1>

        <p className="text-base md:text-xl mb-6 max-w-2xl mx-auto">
          {lang === "ar"
            ? "أول منصة عربية تعتمد على الذكاء الاصطناعي والواقع الافتراضي لتقديم الاستشارات القانونية."
            : "The first Arabic platform leveraging AI and VR to provide legal consultations."}
        </p>

        {/* زر الاستشارة الذكية */}
        <button
          onClick={() => setChatVisible(!chatVisible)}
          className="mb-6 bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition z-20 relative text-sm"
        >
          {lang === "ar" ? "ابدأ الاستشارة الذكية" : "Start Smart Consultation"}
        </button>

        {/* الإحصاءات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center z-10 relative">
          <div className="p-3 bg-blue-900 bg-opacity-70 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-300 mb-1">1000+</div>
            <p className="text-xs">
              {lang === "ar" ? "قضية معالجة" : "Cases Processed"}
            </p>
          </div>
          <div className="p-3 bg-blue-900 bg-opacity-70 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-300 mb-1">99%</div>
            <p className="text-xs">
              {lang === "ar" ? "دقة في التحليل" : "Analysis Accuracy"}
            </p>
          </div>
          <div className="p-3 bg-blue-900 bg-opacity-70 rounded-lg backdrop-blur-sm">
            <div className="text-2xl font-bold text-yellow-300 mb-1">24/7</div>
            <p className="text-xs">
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
