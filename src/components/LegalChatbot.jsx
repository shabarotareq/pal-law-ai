import React, { useState, useRef, useEffect } from 'react';
import api, { setAuthToken } from '../api/api';


export default function LegalChatbot({ token }) {
const [messages, setMessages] = useState([
{ role: 'bot', content: '👋 أهلاً! أنا المساعد القانوني الذكي. كيف أقدر أساعدك؟' }
]);
const [input, setInput] = useState('');
const [chatId, setChatId] = useState(null);
const [loading, setLoading] = useState(false);
const listRef = useRef();


useEffect(() => {
if (token) setAuthToken(token);
}, [token]);


useEffect(() => {
if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
}, [messages, loading]);


const sendMessage = async () => {
if (!input.trim()) return;
const userMsg = { role: 'user', content: input };
setMessages(prev => [...prev, userMsg]);
const toSend = input;
setInput('');
setLoading(true);
try {
const res = await api.post('/api/chatbot', { message: toSend, chatId });
const { reply, chatId: returnedId } = res.data;
setMessages(prev => [...prev, { role: 'bot', content: reply }]);
if (returnedId) setChatId(returnedId);
} catch (err) {
setMessages(prev => [...prev, { role: 'bot', content: '⚠️ حدث خطأ. حاول لاحقاً.' }]);
} finally {
setLoading(false);
}
};



export default function LegalChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "👋 أهلاً! أنا المساعد القانوني الذكي. كيف أقدر أساعدك؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ حدث خطأ. حاول مرة أخرى." },
      ]);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white shadow-lg rounded-2xl flex flex-col">
<div className="p-3 border-b">مساعد قانوني</div>
<div ref={listRef} className="p-3 flex-1 overflow-auto space-y-2">
{messages.map((m,i)=>(
<div key={i} className={`p-2 rounded-xl max-w-[80%] ${m.role==='user'? 'ml-auto bg-blue-600 text-white':'mr-auto bg-gray-100
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-xl rounded-2xl p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">⏳ جاري التفكير...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب استفسارك القانوني..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-xl"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
