"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/router";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

// ✅ مكون الشخصيات
function Character({ modelPath, position = [0, 0.6, 0], scale = 1, label }) {
  const { scene } = useGLTF(modelPath);
  const ref = useRef();
  const [pos, setPos] = useState(new THREE.Vector3(...position));

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (label.includes("القاضي")) {
      const judgePos = new THREE.Vector3(-16, 1.2, -2);
      setPos(judgePos);
      if (ref.current) {
        ref.current.position.copy(judgePos);
        ref.current.rotation.set(0, Math.PI / 2, 0);
      }
    } else {
      setPos(new THREE.Vector3(position[0], 0.6, position[2]));
    }
  }, [scene, label, position]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(pos.x, pos.y, pos.z);
      if (!label.includes("القاضي"))
        ref.current.lookAt(new THREE.Vector3(-16, 1.2, -2));
    }
  });

  return (
    <group>
      <primitive ref={ref} object={scene} scale={scale} />
      <Html position={[pos.x, pos.y + 2, pos.z]} center>
        <div className="bg-black/70 text-white text-xs p-2 rounded-md text-center">
          {label}
        </div>
      </Html>
    </group>
  );
}

// ✅ أرضية المحكمة
function TexturedFloor() {
  let texture;
  try {
    texture = useTexture("/textures/wood.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
  } catch {}
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        map={texture}
        color={texture ? undefined : 0x8b4513}
      />
    </mesh>
  );
}

// ✅ نموذج المحكمة
function CourtroomModel() {
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

// ✅ تدوير الكاميرا نحو القاضي
function AutoRotateToJudge() {
  const { camera, controls } = useThree();
  const [hasRotated, setHasRotated] = useState(false);

  useFrame(() => {
    if (controls && !hasRotated) {
      controls.target.set(-16, 1.2, -2);
      const radius = Math.sqrt(18 ** 2 + 12 ** 2);
      const angle = Math.atan2(12, 18) + Math.PI / 2;
      const newX = -16 - radius * Math.cos(angle);
      const newZ = -2 + radius * Math.sin(angle);
      camera.position.set(newX, 6, newZ);
      controls.update();
      setHasRotated(true);
    }
  });
  return null;
}

// ✅ الصفحة الرئيسية + الخوادم + المحكمة
export default function VirtualCourt() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showCourt, setShowCourt] = useState(false);

  // بيانات الإدخال الرئيسية
  const [courtType, setCourtType] = useState("");
  const [location, setLocation] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [colleagues, setColleagues] = useState([]);
  const [newColleague, setNewColleague] = useState("");

  // الخوادم
  const [servers, setServers] = useState([
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
  ]);

  const getDelayColor = (delay) => {
    if (delay === 0) return "bg-green-600";
    if (delay <= 2) return "bg-yellow-500";
    return "bg-red-600";
  };

  const handleButtonAction = (btn) => {
    switch (btn) {
      case "اتصال":
        alert("✅ تم الاتصال بالخادم!");
        break;
      case "تحديث":
      case "تحديث سريع":
      case "تحديث الكل":
        alert("🔄 تم تحديث بيانات الخوادم");
        break;
      case "إضافة خادم":
        setServers([
          ...servers,
          {
            server: `خادم ${servers.length + 1}`,
            session: "10:00",
            persons: "محامي، شاهد",
            map: "جديد",
            delay: Math.floor(Math.random() * 3),
          },
        ]);
        alert("➕ تم إضافة خادم جديد");
        break;
      case "تغيير التصفيات":
        alert("⚙️ نافذة تغيير التصفيات (محاكاة)");
        break;
      default:
        alert(`⚠️ الزر "${btn}" غير معرف بعد`);
    }
  };

  // التبويبات
  const tabs = [
    {
      title: "الانترنت",
      content: (
        <table className="w-full text-white border border-white/40">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-white/40">الخوادم</th>
              <th className="p-2 border border-white/40">الجلسة</th>
              <th className="p-2 border border-white/40">الشخوص</th>
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
                  {row.delay} ثانية
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
        <div className="text-white text-center py-6">
          ⭐ هنا ستظهر الخوادم المفضلة لديك
        </div>
      ),
      buttons: ["إضافة خادم", "تحديث", "اتصال"],
    },
    {
      title: "التاريخ",
      content: (
        <div className="text-white text-center py-6">
          🕘 سجل الجلسات السابقة
        </div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "المعاينة",
      content: (
        <div className="text-white text-center py-6">محتوى المعاينة هنا...</div>
      ),
      buttons: ["تغيير التصفيات", "تحديث الكل", "اتصال"],
    },
    {
      title: "شبكة محلية",
      content: (
        <div className="text-white text-center py-6">
          محتوى الشبكة المحلية هنا...
        </div>
      ),
      buttons: ["تحديث", "اتصال"],
    },
    {
      title: "الزملاء",
      content: (
        <div className="text-white space-y-4">
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

  // 👉 واجهة
  return (
    <div className="w-screen h-screen">
      {!showCourt ? (
        // ✅ الشاشة الرئيسية
        <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 p-4 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-6">🏛️ المحكمة الافتراضية</h1>

          {/* بيانات المحكمة */}
          <div className="bg-white/10 rounded-xl p-6 w-full max-w-lg space-y-4">
            <input
              type="text"
              placeholder="نوع المحكمة"
              value={courtType}
              onChange={(e) => setCourtType(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="مكان المحكمة"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="رقم القضية"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="رقم الجلسة"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>

          {/* الأزرار */}
          <div className="flex flex-col gap-4 w-full max-w-xs mt-6">
            <button
              onClick={() => setShowOverlay(true)}
              className="w-full px-6 py-3 bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              🛰️ اكتشف الخوادم
            </button>

            <button
              onClick={() => setShowCourt(true)}
              className="w-full px-6 py-3 bg-pink-500 rounded-xl shadow-lg hover:bg-pink-600 transition"
            >
              🎥 دخول المحكمة
            </button>

            <button
              onClick={() => alert("🚀 إنشاء خادم قريبًا")}
              className="w-full px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-lg hover:bg-yellow-300 transition"
            >
              🚀 أنشئ خادم جديد
            </button>

            <button
              onClick={() => alert("👥 الزملاء قريبًا")}
              className="w-full px-6 py-3 bg-purple-600 rounded-xl shadow-lg hover:bg-purple-700 transition"
            >
              👥 الزملاء
            </button>

            <button
              onClick={() => alert("⚙️ الخيارات قريبًا")}
              className="w-full px-6 py-3 bg-gray-600 rounded-xl shadow-lg hover:bg-gray-700 transition"
            >
              ⚙️ الخيارات
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-red-600 rounded-xl shadow-lg hover:bg-red-700 transition"
            >
              ⬅️ العودة
            </button>
          </div>

          {/* Overlay الخوادم */}
          {showOverlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="w-[900px] max-w-[95%] h-[500px] bg-gray-900 rounded-xl shadow-2xl text-white flex flex-col relative border border-white/30">
                <h2 className="text-2xl font-bold mb-4 text-center mt-4">
                  🛰️ الخوادم المتوفرة
                </h2>

                {/* Tabs */}
                <div className="flex justify-start px-4 gap-2 mb-0">
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`flex-1 py-2 font-semibold transition-all duration-300 ${
                        activeTab === index
                          ? "bg-yellow-400 text-black shadow-md rounded-t-xl"
                          : "bg-white/20 text-white hover:bg-white/30 rounded-t-xl"
                      }`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {/* محتوى التبويب */}
                <div className="flex-1 p-6 overflow-y-auto bg-white/10 text-white rounded-b-xl mx-4 mt-0 rounded-t-none">
                  {tabs[activeTab].content}
                </div>

                {/* أزرار التبويب */}
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

                {/* زر إغلاق */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowOverlay(false)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // ✅ المحكمة ثلاثية الأبعاد
        <Canvas shadows camera={{ position: [-28, 6, 7], fov: 40 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 15, 5]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <TexturedFloor />
            <CourtroomModel />
            <Character
              modelPath="/models/judge.glb"
              scale={1.2}
              label="القاضي"
            />
            <Character
              modelPath="/models/lawyer.glb"
              position={[-11, 0.6, 1]}
              scale={1.2}
              label="المحامي"
            />
            <Character
              modelPath="/models/witness.glb"
              position={[3, 0.6, 2]}
              scale={1.2}
              label="الشاهد"
            />

            {colleagues.map((col, index) => {
              const angle = (index / colleagues.length) * Math.PI * 2;
              const radius = 4;
              const x = -16 + radius * Math.cos(angle);
              const z = -2 + radius * Math.sin(angle);
              return (
                <Character
                  key={`${col}-${index}`}
                  modelPath="/models/witness.glb"
                  position={[x, 0.6, z]}
                  scale={1}
                  label={col}
                />
              );
            })}

            <Environment preset="city" />
            <AutoRotateToJudge />
          </Suspense>
          <OrbitControls target={[-16, 1.2, -2]} enablePan enableZoom />
        </Canvas>
      )}
    </div>
  );
}
