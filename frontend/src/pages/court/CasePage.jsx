// frontend/pages/court/[caseId].js
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/router"; // ✅ بدل useParams
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { initSocket } from "../../lib/socket";
import HUD from "../../components/HUD";
import CharacterGLTF from "../../components/CharacterGLTF";
import MainMenu from "../../components/court/MainMenu";
import SessionSettings from "../../components/SessionSettings";
import jsPDF from "jspdf";

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

// ✅ الصفحة الرئيسية للجلسة
export default function CourtPage() {
  const router = useRouter();
  const { caseId } = router.query; // ✅ جلب caseId من الرابط

  const [screen, setScreen] = useState("menu"); // menu | settings | court
  const [caseFile, setCaseFile] = useState({});
  const [sessionActive, setSessionActive] = useState(false);

  // 🔌 تهيئة Socket عند الدخول
  useEffect(() => {
    const socket = initSocket();
    socket.on("connect", () => console.log("✅ Connected to server"));
    socket.on("caseData", (data) => setCaseFile(data));
    socket.on("sessionActive", () => setSessionActive(true));
    return () => socket.disconnect();
  }, []);

  // 📄 حفظ ملف PDF
  const handleSavePDF = () => {
    if (!caseFile.caseNumber) return;
    const doc = new jsPDF();
    doc.text(`Case File: ${caseFile.caseNumber}`, 10, 10);
    doc.text(`Court: ${caseFile.court} ${caseFile.subCourt || ""}`, 10, 20);
    doc.text(`City: ${caseFile.city}`, 10, 30);
    doc.save(`Case_${caseFile.caseNumber}.pdf`);
  };

  const handleShowCaseFile = () => alert(JSON.stringify(caseFile, null, 2));

  // ✅ Preload النماذج
  useEffect(() => {
    useGLTF.preload("/models/courtroom.glb");
    useGLTF.preload("/models/judge.glb");
    useGLTF.preload("/models/lawyer.glb");
    useGLTF.preload("/models/witness.glb");
    /* useGLTF.preload("/models/defendant.glb");
    useGLTF.preload("/models/audience.glb"); */
  }, []);

  return (
    <div className="w-screen h-screen relative bg-gray-900 text-white">
      {/* شاشة القائمة الرئيسية */}
      {screen === "menu" && <MainMenu onSelect={setScreen} />}

      {/* شاشة إعدادات الجلسة */}
      {screen === "settings" && (
        <SessionSettings
          onBack={() => setScreen("menu")}
          onEnter={() => setScreen("court")}
        />
      )}

      {/* شاشة المحكمة */}
      {screen === "court" && (
        <>
          <HUD
            caseFile={caseFile}
            onSave={handleSavePDF}
            onShow={handleShowCaseFile}
          />
          {sessionActive ? (
            <Canvas shadows camera={{ position: [-20, 8, 15], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
              />
              <Suspense fallback={null}>
                <CourtroomModel />
                <CharacterGLTF
                  modelPath="/models/judge.glb"
                  position={[0, 0.6, -8]}
                  scale={1.3}
                  label="القاضي"
                />
                <CharacterGLTF
                  modelPath="/models/lawyer.glb"
                  position={[-6, 0.6, -2]}
                  scale={1.2}
                  label="المحامي"
                />
                <CharacterGLTF
                  modelPath="/models/defendant.glb"
                  position={[0, 0.6, -2]}
                  scale={1.2}
                  label="المتهم"
                />
                <CharacterGLTF
                  modelPath="/models/witness.glb"
                  position={[6, 0.6, -2]}
                  scale={1.2}
                  label="الشاهد"
                />
                <CharacterGLTF
                  modelPath="/models/audience.glb"
                  position={[0, 0.6, 5]}
                  scale={2}
                  label="الجمهور"
                />
                <Environment preset="city" />
              </Suspense>
              <OrbitControls target={[0, 1.2, -4]} enablePan enableZoom />
            </Canvas>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/80">
              <h1 className="text-2xl">⏳ في انتظار بدء الجلسة ...</h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}
