"use client";
import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import jsPDF from "jspdf";

// 🎭 تحميل نموذج المحكمة
function CourtroomModel() {
  const { scene } = useGLTF("/models/courtroom.glb");
  useEffect(() => {
    scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });
  }, [scene]);
  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}

// 🎭 شخصيات المحكمة
function Character({ modelPath, position, label, scale = 1 }) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (ref.current) ref.current.position.set(...position);
  });

  return (
    <group>
      <primitive ref={ref} object={scene} scale={scale} />
      <Html position={[position[0], position[1] + 2, position[2]]} center>
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded text-center">
          {label}
        </div>
      </Html>
    </group>
  );
}

// 🎛️ اختيار الشخصية
function CharacterSelector({ selected, onSelect }) {
  const characters = ["القاضي", "المحامي", "المتهم", "الشاهد", "الجمهور"];
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

// 🎛️ القائمة الرئيسية
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

// 🛰️ نافذة الخوادم
function ServersOverlay({ onClose }) {
  const [activeTab, setActiveTab] = useState(0);
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
  const getDelayColor = (d) =>
    d === 0 ? "bg-green-600" : d <= 2 ? "bg-yellow-500" : "bg-red-600";
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
            {servers.map((r, i) => (
              <tr key={i}>
                <td className="p-2 border border-white/40">{r.server}</td>
                <td className="p-2 border border-white/40">{r.session}</td>
                <td className="p-2 border border-white/40">{r.persons}</td>
                <td className="p-2 border border-white/40">{r.map}</td>
                <td
                  className={`p-2 border border-white/40 text-center ${getDelayColor(
                    r.delay
                  )}`}
                >
                  {r.delay} ث
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      title: "المفضلة",
      content: (
        <div className="text-center text-white py-6">⭐ المفضلة فارغة</div>
      ),
    },
    {
      title: "التاريخ",
      content: (
        <div className="text-center text-white py-6">🕘 لا يوجد تاريخ</div>
      ),
    },
    {
      title: "المعاينة",
      content: <div className="text-center text-white py-6">🔍 المعاينة</div>,
    },
    {
      title: "شبكة محلية",
      content: (
        <div className="text-center text-white py-6">📡 الشبكة المحلية</div>
      ),
    },
    {
      title: "الزملاء",
      content: (
        <div className="text-center text-white py-6">👥 قائمة الزملاء</div>
      ),
    },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-[900px] max-w-[95%] h-[500px] bg-gray-900 rounded-xl shadow-2xl text-white flex flex-col relative border border-white/30">
        <h2 className="text-2xl font-bold mb-4 text-center mt-4">
          🛰️ الخوادم المتوفرة
        </h2>
        <div className="flex justify-start px-4 gap-2 mb-0">
          {tabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 font-semibold transition-all duration-300 ${
                activeTab === i
                  ? "bg-yellow-400 text-black shadow-md rounded-t-xl"
                  : "bg-white/20 text-white hover:bg-white/30 rounded-t-xl"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-white/10 text-white rounded-b-xl mx-4 mt-0 rounded-t-none">
          {tabs[activeTab].content}
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

// ⚙️ إعدادات المحكمة
function CourtSettings({ onBack, onEnter, caseFile, setCaseFile }) {
  const savePDF = () => {
    const doc = new jsPDF();
    doc.text(`المحكمة: ${caseFile.court} ${caseFile.subCourt || ""}`, 10, 10);
    doc.text(`المدينة: ${caseFile.city}`, 10, 20);
    doc.text(`القضية: ${caseFile.caseNumber}`, 10, 30);
    doc.text(`الجلسة: ${caseFile.sessionNumber}`, 10, 40);
    doc.text(`التاريخ: ${caseFile.date}`, 10, 50);
    doc.text(`الوقت: ${caseFile.time}`, 10, 60);
    doc.text(`الشخصية: ${caseFile.character}`, 10, 70);
    doc.save(`Case_${caseFile.caseNumber}.pdf`);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">⚖️ إعدادات المحكمة</h2>
      <div className="grid gap-3 w-full max-w-md">
        <select
          className="p-2 text-black rounded"
          value={caseFile.court}
          onChange={(e) => setCaseFile({ ...caseFile, court: e.target.value })}
        >
          <option value="">اختر نوع المحكمة</option>
          <option value="الصلح">محكمة الصلح</option>
          <option value="الشرعية">المحكمة الشرعية</option>
          <option value="العليا">المحكمة العليا</option>
        </select>
        {caseFile.court === "الصلح" && (
          <select
            className="p-2 text-black rounded"
            value={caseFile.subCourt}
            onChange={(e) =>
              setCaseFile({ ...caseFile, subCourt: e.target.value })
            }
          >
            <option value="">اختر فرع المحكمة</option>
            <option value="البداية">محكمة البداية</option>
            <option value="الاستئناف">محكمة الاستئناف</option>
            <option value="النقض">محكمة النقض</option>
          </select>
        )}
        <input
          className="p-2 text-black rounded"
          type="text"
          placeholder="🏙️ المدينة"
          value={caseFile.city}
          onChange={(e) => setCaseFile({ ...caseFile, city: e.target.value })}
        />
        <input
          className="p-2 text-black rounded"
          type="text"
          placeholder="📑 رقم القضية"
          value={caseFile.caseNumber}
          onChange={(e) =>
            setCaseFile({ ...caseFile, caseNumber: e.target.value })
          }
        />
        <input
          className="p-2 text-black rounded"
          type="text"
          placeholder="🔢 رقم الجلسة"
          value={caseFile.sessionNumber}
          onChange={(e) =>
            setCaseFile({ ...caseFile, sessionNumber: e.target.value })
          }
        />
        <input
          className="p-2 text-black rounded"
          type="date"
          value={caseFile.date}
          onChange={(e) => setCaseFile({ ...caseFile, date: e.target.value })}
        />
        <input
          className="p-2 text-black rounded"
          type="time"
          value={caseFile.time}
          onChange={(e) => setCaseFile({ ...caseFile, time: e.target.value })}
        />
      </div>
      <CharacterSelector
        selected={caseFile.character}
        onSelect={(c) => setCaseFile({ ...caseFile, character: c })}
      />
      <div className="flex gap-4 mt-6">
        <button
          className="bg-green-600 px-5 py-2 rounded-xl shadow hover:bg-green-700"
          onClick={() =>
            caseFile.character === "القاضي" || caseFile.sessionNumber
              ? onEnter()
              : alert("❌ يجب أن تكون القاضي أو الجلسة منعقدة")
          }
        >
          🚪 دخول الجلسة
        </button>
        <button
          className="bg-yellow-500 px-5 py-2 rounded-xl shadow hover:bg-yellow-600 text-black font-bold"
          onClick={savePDF}
        >
          💾 حفظ الملف
        </button>
        <button
          className="bg-gray-600 px-5 py-2 rounded-xl shadow hover:bg-gray-700"
          onClick={onBack}
        >
          ↩️ العودة
        </button>
      </div>
    </div>
  );
}

// 🎥 المحكمة 3D
function Court3D({ caseFile }) {
  const positions = [
    {
      name: "القاضي",
      model: "/models/judge.glb",
      pos: [-2, 0.6, -2],
      scale: 1.2,
    },
    {
      name: "المحامي",
      model: "/models/lawyer.glb",
      pos: [0, 0.6, -1],
      scale: 1.2,
    },
    {
      name: "الشاهد",
      model: "/models/witness.glb",
      pos: [2, 0.6, 0],
      scale: 1.2,
    },
    /*  {
      name: "المتهم",
      model: "/models/defendant.glb",
      pos: [0, 0.6, 1],
      scale: 1.2,
    },
      {
      name: "الجمهور",
      model: "/models/public.glb",
      pos: [4, 0.6, 2],
      scale: 1,
    }, */
  ];
  return (
    <div className="w-screen h-screen relative bg-black text-white">
      <div className="absolute top-2 left-2 bg-gray-800/80 p-3 rounded-lg text-sm">
        <p>
          ⚖️ المحكمة: {caseFile.court} {caseFile.subCourt || ""}
        </p>
        <p>🏙️ المدينة: {caseFile.city}</p>
        <p>📑 القضية: {caseFile.caseNumber}</p>
        <p>🔢 الجلسة: {caseFile.sessionNumber}</p>
        <p>
          📅 {caseFile.date} ⏰ {caseFile.time}
        </p>
        <p>👤 الشخصية: {caseFile.character}</p>
      </div>
      <Canvas shadows camera={{ position: [-15, 8, 15], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <CourtroomModel />
          {positions.map((p, i) => (
            <Character
              key={i}
              modelPath={p.model}
              position={p.pos}
              label={p.name}
              scale={p.scale}
            />
          ))}
          <Environment preset="city" />
        </Suspense>
        <OrbitControls target={[0, 1.2, -4]} enablePan enableZoom />
      </Canvas>
    </div>
  );
}

// 🏁 التطبيق الرئيسي
export default function VirtualCourt() {
  const [screen, setScreen] = useState("menu");
  const [showServers, setShowServers] = useState(false);
  const [caseFile, setCaseFile] = useState({
    court: "",
    subCourt: "",
    city: "",
    caseNumber: "",
    sessionNumber: "",
    date: "",
    time: "",
    character: "",
  });

  return (
    <>
      {screen === "menu" && (
        <MainMenu
          onDiscover={() => setShowServers(true)}
          onSettings={() => setScreen("settings")}
          onExit={() => setScreen("exit")}
        />
      )}
      {showServers && <ServersOverlay onClose={() => setShowServers(false)} />}
      {screen === "settings" && (
        <CourtSettings
          caseFile={caseFile}
          setCaseFile={setCaseFile}
          onBack={() => setScreen("menu")}
          onEnter={() => setScreen("court")}
        />
      )}
      {screen === "court" && <Court3D caseFile={caseFile} />}
      {screen === "exit" && (
        <div className="text-center mt-20">👋 تم الخروج</div>
      )}
    </>
  );
}
