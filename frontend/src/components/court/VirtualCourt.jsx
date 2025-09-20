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
function ServersOverlay({ onClose }) {
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

  const handleButtonAction = (btn) => {
    alert(`⚡ تم الضغط على: ${btn}`);
  };

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
      content: <div className="text-center text-white py-6">🔍 المعاينة</div>,
      buttons: ["تغيير التصفيات", "تحديث الكل", "اتصال"],
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
              onClick={() => handleButtonAction(btn)}
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

// ======================== المحكمة ثلاثية الأبعاد مع التحدث ========================
function Court3D({ caseFile, colleagues = [] }) {
  const [speechData, setSpeechData] = useState({});
  const [inputText, setInputText] = useState("");
  const [canSpeak, setCanSpeak] = useState({
    القاضي: true,
    المدعي: false,
    المحامي: false,
    المتهم: false,
    الشاهد: false,
    الجمهور: false,
  });

  const cameraTarget = [-16, 1.2, -2];

  const handleSpeak = (role) => {
    if (!inputText) return;
    if (!canSpeak[role]) {
      alert("❌ ليس لديك صلاحية التحدث حالياً.");
      return;
    }
    setSpeechData((prev) => ({ ...prev, [role]: inputText }));
    const doc = new jsPDF();
    doc.text(`${role}: ${inputText}`, 10, 10);
    doc.save(`Case_${caseFile.caseNumber}_speech.pdf`);
    setInputText("");
  };

  const toggleRoleSpeaking = (role) => {
    setCanSpeak((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const [showInstructions, setShowInstructions] = useState(false);
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        setShowInstructions((prev) => !prev);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <div className="w-screen h-screen relative bg-black text-white flex">
      {/* اللوحة الجانبية */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gray-900/90 p-4 text-sm overflow-y-auto z-10">
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

        {/* صلاحيات القاضي */}
        {caseFile.character === "القاضي" && (
          <div className="mt-4 space-y-2">
            <p className="font-bold">إدارة صلاحيات التحدث:</p>
            {Object.keys(canSpeak).map(
              (role) =>
                role !== "القاضي" && (
                  <div
                    key={role}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{role}</span>
                    <button
                      onClick={() => toggleRoleSpeaking(role)}
                      className={`px-2 py-1 rounded text-white ${
                        canSpeak[role]
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {canSpeak[role] ? "مسموح" : "ممنوع"}
                    </button>
                  </div>
                )
            )}
          </div>
        )}

        {/* صندوق التحدث */}
        <div className="mt-4 space-y-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب ما تريد قوله..."
            className="w-full p-2 rounded text-black"
          />
          <button
            onClick={() => handleSpeak(caseFile.character)}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded text-white font-bold"
          >
            🗣️ تحدث
          </button>
        </div>

        {/* تعليمات F1 */}
        {showInstructions && (
          <div className="mt-4 p-2 bg-gray-700 rounded text-xs space-y-1">
            <p>ℹ️ تعليمات التحدث والقواعد:</p>
            <ul className="list-disc list-inside text-white">
              <li>القاضي: يمكنه التحدث ومنح الصلاحيات.</li>
              <li>المدعي/المحامي: التحدث فقط بإذن القاضي.</li>
              <li>المتهم: يجيب على الاستفسارات فقط.</li>
              <li>الشهود: يجيب على الاستجوابات.</li>
              <li>الجمهور: ممنوع الكلام إلا بإذن القاضي.</li>
              <li>المحادثات تظهر لمدة 30 ثانية فوق المتحدث.</li>
              <li>يتم حفظ كل حديث تلقائياً في ملف القضية.</li>
            </ul>
          </div>
        )}
      </div>

      {/* مشهد المحكمة */}
      <div className="flex-1">
        <Canvas shadows camera={{ position: [-25, 5, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 15, 5]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <TexturedFloor />
            <Courtroom3DModel />
            <Character
              modelPath="/models/judge.glb"
              scale={1.2}
              label="القاضي"
              speech={speechData["القاضي"]}
            />
            <Character
              modelPath="/models/lawyer.glb"
              position={[-11, 0.6, 1]}
              scale={1.2}
              label="المحامي"
              speech={speechData["المحامي"]}
            />
            <Character
              modelPath="/models/witness.glb"
              position={[3, 0.6, 2]}
              scale={1.2}
              label="الشاهد"
              speech={speechData["الشاهد"]}
            />
            {colleagues.map((col, index) => {
              const angle = (index / colleagues.length) * Math.PI * 2;
              const radius = 4;
              const x = -16 + radius * Math.cos(angle);
              const z = -2 + radius * Math.sin(angle);
              const label = `${col.name}${
                col.caseNumber ? ` - ${col.caseNumber}` : ""
              }`;
              return (
                <Character
                  key={`${col.name}-${index}`}
                  modelPath="/models/witness.glb"
                  position={[x, 0.6, z]}
                  scale={1}
                  label={label}
                  speech={speechData[col.name]}
                />
              );
            })}
            <Environment preset="city" />
          </Suspense>
          <OrbitControls target={cameraTarget} enablePan enableZoom />
        </Canvas>
      </div>
    </div>
  );
}

// ======================== التطبيق الرئيسي ========================
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
          onBack={() => setScreen("menu")}
          onEnter={() => setScreen("court")}
          caseFile={caseFile}
          setCaseFile={setCaseFile}
        />
      )}
      {screen === "court" && <Court3D caseFile={caseFile} />}
      {screen === "exit" && (
        <div className="text-center mt-20">👋 تم الخروج</div>
      )}
    </>
  );
}
