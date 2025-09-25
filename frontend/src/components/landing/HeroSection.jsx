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
  className="relative flex flex-col items-center justify-center h-screen text-white px-6 overflow-hidden"
>
  {/* الخلفية */}
  <img
    src="/assets/court.png"
    alt="court"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* طبقة شفافة عامة */}
  <div className="absolute inset-0 bg-black bg-opacity-40"></div>

  {/* المحتوى */}
  <div className="relative z-10 max-w-4xl w-full text-center mt-16">
    <div className="bg-black bg-opacity-50 rounded-2xl p-8 shadow-2xl">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
        {lang === "ar" ? (
          <>
            منصة <span className="text-yellow-300">عدالة AI</span>
          </>
        ) : (
          "Adala AI Platform"
        )}
      </h1>

      <p className="text-base md:text-xl mb-6 max-w-2xl mx-auto drop-shadow-md">
        {lang === "ar"
          ? "أول منصة عربية تعتمد على الذكاء الاصطناعي والواقع الافتراضي لتقديم الاستشارات القانونية."
          : "The first Arabic platform leveraging AI and VR to provide legal consultations."}
      </p>

      {/* زر الاستشارة */}
      <button
        onClick={() => setChatVisible(!chatVisible)}
        className="mb-8 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition text-sm md:text-base shadow-lg"
      >
        {lang === "ar" ? "ابدأ الاستشارة الذكية" : "Start Smart Consultation"}
      </button>

      {/* الإحصاءات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-900 bg-opacity-80 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-300 mb-2">1000+</div>
          <p className="text-sm">
            {lang === "ar" ? "قضية معالجة" : "Cases Processed"}
          </p>
        </div>
        <div className="p-4 bg-blue-900 bg-opacity-80 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-300 mb-2">99%</div>
          <p className="text-sm">
            {lang === "ar" ? "دقة في التحليل" : "Analysis Accuracy"}
          </p>
        </div>
        <div className="p-4 bg-blue-900 bg-opacity-80 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-300 mb-2">24/7</div>
          <p className="text-sm">
            {lang === "ar" ? "دعم متواصل" : "Continuous Support"}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default HeroSection;
