// VirtualCourt.jsx
import React, { Suspense, useRef, useState, useEffect } from "react";
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

// ✅ مكون الشخصيات
function Character({ modelPath, position = [0, 0, 0], scale = 1, label }) {
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

    // موضع القاضي
    if (label === "القاضي") {
      const judgePos = new THREE.Vector3(0, 0.2, -5);
      setPos(judgePos);
      if (ref.current) ref.current.position.copy(judgePos);
    } else {
      // ضبط ارتفاع الشخصيات الأخرى
      setPos(new THREE.Vector3(...position.map((v, i) => (i === 1 ? 0 : v))));
    }
  }, [scene, label, position]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(pos.x, pos.y, pos.z);
      if (label !== "القاضي") {
        // مواجهة القاضي
        ref.current.lookAt(new THREE.Vector3(0, pos.y, -5));
      }
    }
  });

  const move = (dx, dz) =>
    setPos((prev) => new THREE.Vector3(prev.x + dx, prev.y, prev.z + dz));

  return (
    <group>
      <primitive ref={ref} object={scene} scale={scale} />
      <Html position={[pos.x, pos.y + 2, pos.z]} center>
        <div className="bg-black/70 text-white text-xs p-2 rounded-md">
          {label}
          <div className="flex gap-1 mt-1">
            <button onClick={() => move(0, -0.2)}>⬆</button>
            <button onClick={() => move(-0.2, 0)}>⬅</button>
            <button onClick={() => move(0.2, 0)}>➡</button>
            <button onClick={() => move(0, 0.2)}>⬇</button>
          </div>
        </div>
      </Html>
    </group>
  );
}

// ✅ Preload models
useGLTF.preload("/models/judge.glb");
useGLTF.preload("/models/lawyer.glb");
useGLTF.preload("/models/witness.glb");
useGLTF.preload("/models/courtroom.glb");

// ✅ أرضية المحكمة بخامة خشبية
function TexturedFloor() {
  let texture;
  try {
    texture = useTexture("/textures/wood.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
  } catch (e) {
    console.warn("Texture not found, using default color");
  }

  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
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
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />;
}

// ✅ المكون الرئيسي
export default function VirtualCourt({ language = "ar" }) {
  const [showSettings, setShowSettings] = useState(true);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [courtMain, setCourtMain] = useState("");
  const [courtSub, setCourtSub] = useState("");
  const [city, setCity] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [sessionNumber, setSessionNumber] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [saveFile, setSaveFile] = useState(false);
  const [caseFile, setCaseFile] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showSettings) setShowSettings(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSettings]);

  const handleStart = () => {
    if (
      !role ||
      !name ||
      !courtMain ||
      (courtMain === "صلح" && !courtSub) ||
      !city ||
      !caseNumber ||
      !sessionNumber ||
      !sessionDate ||
      !sessionTime
    ) {
      alert(
        language === "en"
          ? "Please fill all required fields"
          : "الرجاء تعبئة جميع الحقول المطلوبة"
      );
      return;
    }

    if (role === "القاضي") {
      const now = new Date();
      const sessionDT = new Date(`${sessionDate}T${sessionTime}`);
      if (now >= sessionDT) setSessionActive(true);
      else {
        alert(
          language === "en"
            ? "Session cannot start before scheduled time"
            : "لا يمكن انعقاد الجلسة قبل وقتها"
        );
        return;
      }
    } else if (!sessionActive) {
      alert(
        language === "en"
          ? "Cannot join before session starts"
          : "لا يمكنك الانضمام قبل انعقاد الجلسة"
      );
      return;
    }

    // إنشاء ملف القضية
    setCaseFile({
      court: courtMain,
      subCourt: courtSub,
      city,
      caseNumber,
      sessionNumber,
      plaintiffs: [],
      defendants: [],
      charges: [],
      procedures: [],
      witnesses: [],
      evidence: [],
      verdicts: [],
    });

    setShowSettings(false);
  };

  const handleSavePDF = () => {
    if (!caseFile.caseNumber) return;
    const doc = new jsPDF();
    doc.text(`Case File: ${caseFile.caseNumber}`, 10, 10);
    doc.text(`Court: ${caseFile.court} ${caseFile.subCourt || ""}`, 10, 20);
    doc.text(`City: ${caseFile.city}`, 10, 30);
    doc.save(`Case_${caseFile.caseNumber}.pdf`);
  };

  const handleShowCaseFile = () => alert(JSON.stringify(caseFile, null, 2));

  const labels =
    language === "en"
      ? {
          selectCharacter: "Select your character",
          enterName: "Enter your name",
          chooseCourt: "Choose court",
          enterCity: "City",
          caseNo: "Case number",
          sessionNo: "Session number",
          date: "Date",
          time: "Time",
          startSession: "Start Session",
          saveFile: "Save case file",
          viewFile: "View case file",
        }
      : {
          selectCharacter: "اختر شخصيتك",
          enterName: "ادخل الاسم",
          chooseCourt: "اختر المحكمة",
          enterCity: "اسم المدينة",
          caseNo: "رقم القضية",
          sessionNo: "رقم الجلسة",
          date: "تاريخ الجلسة",
          time: "ساعة الانعقاد",
          startSession: "دخول الجلسة",
          saveFile: "حفظ ملف القضية",
          viewFile: "عرض ملف القضية",
        };

  return (
    <div className="w-screen h-screen relative">
      {showSettings && (
        <div className="absolute inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-400 to-blue-700 rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-300 text-gray-900">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
              ⚖️ {language === "en" ? "Virtual Court" : "المحكمة الافتراضية"}
            </h1>
            <p className="text-white text-sm">
              {language === "en"
                ? "Interactive platform to simulate court sessions"
                : "منصة تفاعلية لمحاكاة جلسات المحكمة"}
              <br />
              {language === "en"
                ? "3D experience with multiplayer support"
                : "تجربة ثلاثية الأبعاد مع مشاركة متعددة اللاعبين"}
            </p>

            <h2 className="text-lg font-semibold text-white">
              {labels.selectCharacter}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {["القاضي", "المحامي", "الشاهد"].map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => setRole(roleOption)}
                  className={`p-3 rounded-lg text-white font-medium ${
                    role === roleOption
                      ? "bg-blue-900"
                      : "bg-gradient-to-r from-blue-500 to-blue-700"
                  }`}
                >
                  {language === "en"
                    ? roleOption === "القاضي"
                      ? "Judge"
                      : roleOption === "المحامي"
                      ? "Lawyer"
                      : "Witness"
                    : roleOption}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder={`${labels.enterName} ${role || ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded text-gray-900 placeholder:text-gray-700"
            />

            <select
              value={courtMain}
              onChange={(e) => {
                setCourtMain(e.target.value);
                setCourtSub("");
              }}
              className="w-full p-2 rounded text-gray-900"
            >
              <option value="">{labels.chooseCourt}</option>
              <option value="صلح">
                {language === "en" ? "Conciliation Court" : "محكمة الصلح"}
              </option>
              <option value="شرعية">
                {language === "en" ? "Sharia Court" : "المحكمة الشرعية"}
              </option>
              <option value="عليا">
                {language === "en" ? "Supreme Court" : "المحكمة العليا"}
              </option>
            </select>

            {courtMain === "صلح" && (
              <select
                value={courtSub}
                onChange={(e) => setCourtSub(e.target.value)}
                className="w-full p-2 rounded text-gray-900"
              >
                <option value="">
                  {language === "en" ? "Select branch" : "اختر الفرع"}
                </option>
                <option value="بداية">
                  {language === "en" ? "First Instance" : "محكمة البداية"}
                </option>
                <option value="استئناف">
                  {language === "en" ? "Appeal" : "محكمة الاستئناف"}
                </option>
                <option value="نقض">
                  {language === "en" ? "Cassation" : "محكمة النقض"}
                </option>
              </select>
            )}

            <input
              type="text"
              placeholder={labels.enterCity}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 rounded text-gray-900"
            />
            <input
              type="text"
              placeholder={labels.caseNo}
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full p-2 rounded text-gray-900"
            />
            <input
              type="text"
              placeholder={labels.sessionNo}
              value={sessionNumber}
              onChange={(e) => setSessionNumber(e.target.value)}
              className="w-full p-2 rounded text-gray-900"
            />
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full p-2 rounded text-gray-900"
            />
            <input
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="w-full p-2 rounded text-gray-900"
            />

            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={saveFile}
                onChange={() => setSaveFile(!saveFile)}
              />{" "}
              {labels.saveFile}
            </label>

            <button
              onClick={handleStart}
              className="w-full py-2 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
            >
              {labels.startSession}
            </button>

            {saveFile && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleShowCaseFile}
                  className="py-1 px-2 bg-green-600 text-white rounded"
                >
                  {labels.viewFile}
                </button>
                <button
                  onClick={handleSavePDF}
                  className="py-1 px-2 bg-green-800 text-white rounded"
                >
                  PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!showSettings && (
        <Canvas shadows camera={{ position: [0, 5, 12], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
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
              position={[0, 0, -2]}
              scale={1.2}
              label="المحامي"
            />
            <Character
              modelPath="/models/witness.glb"
              position={[2, 0, -2]}
              scale={1.2}
              label="الشاهد"
            />

            <Environment preset="city" />
          </Suspense>
          <OrbitControls enablePan enableZoom />
        </Canvas>
      )}
    </div>
  );
}
