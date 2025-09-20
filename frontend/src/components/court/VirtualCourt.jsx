"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import jsPDF from "jspdf";

// ======================== شخصيات المحكمة ========================
function Character({
  modelPath,
  position = [0, 0.6, 0],
  scale = 1,
  label,
  speech,
}) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();
  const [pos] = useState(new THREE.Vector3(...position));
  const [showSpeech, setShowSpeech] = useState(false);
  const speechTimeout = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (speech) {
      setShowSpeech(true);
      clearTimeout(speechTimeout.current);
      speechTimeout.current = setTimeout(() => setShowSpeech(false), 30000);
    }
  }, [speech]);

  useFrame(() => {
    if (ref.current && label !== "القاضي") {
      ref.current.lookAt(new THREE.Vector3(-16, 1.2, -2));
    }
  });

  return (
    <group>
      <primitive ref={ref} object={scene} scale={scale} position={pos} />
      <Html position={[pos.x, pos.y + 2, pos.z]} center>
        <div className="bg-black/70 text-white text-xs p-2 rounded-md text-center">
          {label}
        </div>
      </Html>
      {showSpeech && (
        <Html position={[pos.x, pos.y + 3, pos.z]} center>
          <div className="bg-yellow-600/80 text-black p-2 rounded-md text-sm">
            {speech}
          </div>
        </Html>
      )}
    </group>
  );
}

// ======================== نموذج المحكمة ========================
function Courtroom3DModel() {
  const { scene } = useGLTF("/models/courtroom.glb");
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

// ======================== أرضية المحكمة ========================
function TexturedFloor() {
  const texture = useTexture("/textures/wood.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -1.0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// ======================== قائمة الشخصيات ========================
function CharacterSelector({ selected, onSelect }) {
  const characters = [
    "القاضي",
    "المدعي",
    "المحامي",
    "المتهم",
    "الشاهد",
    "الجمهور",
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center">
      {characters.map((c) => (
        <button
          key={c}
          className={`px-4 py-2 rounded-xl shadow ${
            selected === c
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ======================== القائمة الرئيسية ========================
function MainMenu({ onDiscover, onSettings, onExit }) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 p-4">
      <h1 className="text-4xl font-bold mb-8">🏛️ المحكمة الافتراضية</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={onDiscover}
          className="w-full px-6 py-3 bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          🛰️ اكتشف الخوادم
        </button>
        <button
          onClick={onSettings}
          className="w-full px-6 py-3 bg-pink-500 rounded-xl shadow-lg hover:bg-pink-600 transition"
        >
          🎥 دخول المحكمة
        </button>
        <button className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-300 transition">
          🚀 أنشئ خادم جديد
        </button>
        <button className="w-full px-6 py-3 bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700 transition">
          👥 الزملاء
        </button>
        <button className="w-full px-6 py-3 bg-gray-600 rounded-xl shadow-lg hover:bg-gray-700 transition">
          ⚙️ الخيارات
        </button>
        <button
          onClick={onExit}
          className="w-full px-6 py-3 bg-red-600 rounded-xl shadow-lg hover:bg-red-700 transition"
        >
          ⬅️ العودة
        </button>
      </div>
    </div>
  );
}

// ======================== نافذة الخوادم ========================
function ServersOverlay({ onClose, activeServer }) {
  const [activeTab, setActiveTab] = useState(0);
  const [colleagues, setColleagues] = useState(["أحمد", "سارة"]);
  const [newColleague, setNewColleague] = useState("");

  const servers = [
    {
      server: "خادم 1",
      session: "9:00",
      persons: "القاضي، المحامي",
      map: "مركز المدينة",
      delay: 0,
    },
    {
      server: "خادم 2",
      session: "9:30",
      persons: "شاهد، محامي",
      map: "الفرعية",
      delay: 2,
    },
  ];

  const getDelayColor = (delay) =>
    delay === 0 ? "bg-green-600" : delay <= 2 ? "bg-yellow-500" : "bg-red-600";

  const tabs = [
    {
      title: "الانترنت",
      content: (
        <table className="w-full text-white border border-white/40">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-white/40">الخادم</th>
              <th className="p-2 border border-white/40">الجلسة</th>
              <th className="p-2 border border-white/40">الأشخاص</th>
              <th className="p-2 border border-white/40">الخريطة</th>
              <th className="p-2 border border-white/40">التأخير</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((row, i) => (
              <tr key={i}>
                <td className="p-2 border border-white/40">{row.server}</td>
                <td className="p-2 border border-white/40">{row.session}</td>
                <td className="p-2 border border-white/40">{row.persons}</td>
                <td className="p-2 border border-white/40">{row.map}</td>
                <td
                  className={`p-2 border border-white/40 text-center ${getDelayColor(
                    row.delay
                  )}`}
                >
                  {row.delay} ث
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
      buttons: ["تغيير التصفيات", "تحديث سريع", "تحديث الكل", "اتصال"],
    },
    {
      title: "المفضلة",
      content: (
        <div className="text-center text-white py-6">⭐ المفضلة فارغة</div>
      ),
      buttons: ["إضافة خادم", "تحديث", "اتصال"],
    },
    {
      title: "التاريخ",
      content: (
        <div className="text-center text-white py-6">🕘 لا يوجد تاريخ</div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "المعاينة",
      content: activeServer ? (
        <div className="text-white space-y-2">
          <p>⚖️ المحكمة: {activeServer.court}</p>
          <p>📑 القضية: {activeServer.caseNumber}</p>
          <p>🔢 الجلسة: {activeServer.sessionNumber}</p>
          <p>📅 التاريخ: {activeServer.date}</p>
          <p>👥 المشاركون: {activeServer.participants.join(", ")}</p>
        </div>
      ) : (
        <div className="text-center text-white py-6">🔍 لا يوجد سيرفر نشط</div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "شبكة محلية",
      content: (
        <div className="text-center text-white py-6">📡 الشبكة المحلية</div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "الزملاء",
      content: (
        <div className="space-y-4 text-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={newColleague}
              onChange={(e) => setNewColleague(e.target.value)}
              placeholder="أدخل اسم الزميل"
              className="p-2 rounded text-black flex-1"
            />
            <button
              onClick={() => {
                if (newColleague.trim()) {
                  setColleagues([...colleagues, newColleague.trim()]);
                  setNewColleague("");
                }
              }}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
            >
              ➕ إضافة
            </button>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {colleagues.map((col, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-white/10 p-2 rounded"
              >
                {col}
                <button
                  onClick={() =>
                    setColleagues(colleagues.filter((c) => c !== col))
                  }
                  className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 transition text-white"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-[900px] max-w-[95%] h-[500px] bg-gray-900 rounded-xl shadow-2xl text-white flex flex-col relative border border-white/30">
        <h2 className="text-2xl font-bold mb-4 text-center mt-4">
          🛰️ الخوادم المتوفرة
        </h2>
        <div className="flex justify-start px-4 gap-2 mb-0">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 font-semibold transition-all duration-300 ${
                activeTab === i
                  ? "bg-yellow-400 text-black shadow-md rounded-t-xl"
                  : "bg-white/20 text-white hover:bg-white/30 rounded-t-xl"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-white/10 text-white rounded-b-xl mx-4 mt-0 rounded-t-none">
          {tabs[activeTab].content}
        </div>
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-3">
          {tabs[activeTab].buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => alert(`⚡ ${btn}`)}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-white shadow"
            >
              {btn}
            </button>
          ))}
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
// ======================== إعدادات المحكمة ========================
function CourtSettings({ onStart }) {
  const [court, setCourt] = useState("محكمة الصلح");
  const [subCourt, setSubCourt] = useState("");
  const [city, setCity] = useState("القدس");
  const [caseNumber, setCaseNumber] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [role, setRole] = useState("القاضي");

  const handleStart = () => {
    if (!caseNumber || !sessionNumber || !date || !time) {
      alert("⚠️ يرجى إدخال جميع البيانات المطلوبة");
      return;
    }
    onStart({
      court,
      subCourt,
      city,
      caseNumber,
      sessionNumber,
      date,
      time,
      role,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <h2 className="text-3xl font-bold mb-6">⚖️ إعدادات المحكمة</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        <select
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          className="p-2 rounded text-black"
        >
          <option>محكمة الصلح</option>
          <option>المحكمة الشرعية</option>
          <option>المحكمة العليا</option>
        </select>
        {court === "محكمة الصلح" && (
          <select
            value={subCourt}
            onChange={(e) => setSubCourt(e.target.value)}
            className="p-2 rounded text-black"
          >
            <option>محكمة البداية</option>
            <option>محكمة الاستئناف</option>
            <option>محكمة النقض</option>
          </select>
        )}
        <input
          type="text"
          placeholder="📍 المدينة"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="📑 رقم القضية"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="🔢 رقم الجلسة"
          value={sessionNumber}
          onChange={(e) => setSessionNumber(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="p-2 rounded text-black"
        />
        <CharacterSelector selected={role} onSelect={setRole} />
      </div>
      <button
        onClick={handleStart}
        className="mt-6 px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition shadow-lg"
      >
        🚪 دخول الجلسة
      </button>
    </div>
  );
}

// ======================== مشهد المحكمة ========================
function Court3D({ courtData, onExit }) {
  const [messages, setMessages] = useState([]);
  const [currentSpeech, setCurrentSpeech] = useState({});
  const [input, setInput] = useState("");

  const addMessage = (sender, text) => {
    const msg = { sender, text, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, msg]);
    setCurrentSpeech({ ...currentSpeech, [sender]: text });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(courtData.role, input);
    setInput("");
  };

  return (
    <div className="flex w-screen h-screen bg-gray-950">
      {/* === القائمة الجانبية === */}
      <div className="w-72 bg-gray-900 text-white p-4 flex flex-col">
        <h3 className="text-xl font-bold mb-4">📑 تفاصيل الجلسة</h3>
        <p>⚖️ المحكمة: {courtData.court}</p>
        {courtData.subCourt && <p>🏛️ الفرع: {courtData.subCourt}</p>}
        <p>📍 المدينة: {courtData.city}</p>
        <p>📑 رقم القضية: {courtData.caseNumber}</p>
        <p>🔢 رقم الجلسة: {courtData.sessionNumber}</p>
        <p>📅 التاريخ: {courtData.date}</p>
        <p>🕘 الوقت: {courtData.time}</p>
        <p>👤 الدور: {courtData.role}</p>
        <div className="mt-6 flex flex-col gap-2">
          <button className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700">
            ✋ رفع اليد
          </button>
          <button className="px-3 py-2 bg-green-600 rounded hover:bg-green-700">
            🎤 الميكروفون
          </button>
          <button
            onClick={onExit}
            className="px-3 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            ⬅️ العودة
          </button>
        </div>
      </div>

      {/* === مشهد المحكمة === */}
      <div className="flex-1 relative">
        <Canvas shadows camera={{ position: [-16, 2, -2], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Suspense fallback={null}>
            <Courtroom3DModel />
            <TexturedFloor />
            <Character
              modelPath="/models/judge.glb"
              position={[-16, 0, -2]}
              scale={1.2}
              label="القاضي"
              speech={currentSpeech["القاضي"]}
            />
            <Character
              modelPath="/models/lawyer.glb"
              position={[-14, 0, -4]}
              scale={1}
              label="المحامي"
              speech={currentSpeech["المحامي"]}
            />
            {/* 
            <Character
              modelPath="/models/prosecutor.glb"
              position={[-18, 0, -4]}
              scale={1}
              label="المدعي"
              speech={currentSpeech["المدعي"]}
            />
            <Character
              modelPath="/models/defendant.glb"
              position={[-16, 0, -6]}
              scale={1}
              label="المتهم"
              speech={currentSpeech["المتهم"]}
            />
            */}
            <Character
              modelPath="/models/witness.glb"
              position={[-12, 0, -6]}
              scale={1}
              label="الشاهد"
              speech={currentSpeech["الشاهد"]}
            />
          </Suspense>
          <OrbitControls target={[-16, 1, -2]} />
        </Canvas>

        {/* صندوق المحادثة */}
        <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="💬 اكتب رسالتك..."
            className="flex-1 p-2 rounded text-black"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================== المكون الرئيسي ========================
export default function VirtualCourt() {
  const [menu, setMenu] = useState("main"); // main | servers | settings | court
  const [activeServer, setActiveServer] = useState(null);
  const [courtData, setCourtData] = useState(null);

  const handleStartCourt = (data) => {
    setCourtData({ ...data, participants: [data.role] });
    setActiveServer({
      ...data,
      participants: [data.role],
    });
    setMenu("court");
  };

  return (
    <>
      {menu === "main" && (
        <MainMenu
          onDiscover={() => setMenu("servers")}
          onSettings={() => setMenu("settings")}
          onExit={() => alert("⬅️ العودة للرئيسية")}
        />
      )}
      {menu === "servers" && (
        <ServersOverlay
          onClose={() => setMenu("main")}
          activeServer={activeServer}
        />
      )}
      {menu === "settings" && <CourtSettings onStart={handleStartCourt} />}
      {menu === "court" && (
        <Court3D courtData={courtData} onExit={() => setMenu("main")} />
      )}
    </>
  );
}
