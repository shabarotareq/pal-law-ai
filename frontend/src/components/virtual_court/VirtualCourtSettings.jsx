"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

    if (label === "القاضي") {
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
      if (label !== "القاضي")
        ref.current.lookAt(new THREE.Vector3(-16, 1.2, -2));
    }
  });

  return (
    <group>
      <primitive ref={ref} object={scene} scale={scale} />
      <Html position={[pos.x, pos.y + 2, pos.z]} center>
        <div className="bg-black/70 text-white text-xs p-2 rounded-md">
          {label}
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload("/models/judge.glb");
useGLTF.preload("/models/lawyer.glb");
useGLTF.preload("/models/witness.glb");
useGLTF.preload("/models/courtroom.glb");

function TexturedFloor() {
  let texture;
  try {
    texture = useTexture("/textures/wood.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
  } catch (e) {
    console.warn("⚠️ لم يتم العثور على الخامة");
  }

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

  const handleStart = () => {
    if (!role || !name || !courtMain || !city || !caseNumber) {
      alert(language === "en" ? "Fill all fields" : "املأ جميع الحقول");
      return;
    }
    setShowSettings(false);
  };

  const handleSavePDF = () => {
    if (!caseFile.caseNumber) return;
    const doc = new jsPDF();
    doc.text(`Case File: ${caseFile.caseNumber}`, 10, 10);
    doc.save(`Case_${caseFile.caseNumber}.pdf`);
  };

  const labels =
    language === "en"
      ? { startSession: "Start Session" }
      : { startSession: "دخول الجلسة" };

  return (
    <div className="w-screen h-screen relative">
      {showSettings ? (
        <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <h1 className="text-2xl font-bold">
              {language === "en" ? "Virtual Court" : "المحكمة الافتراضية"}
            </h1>
            <input
              type="text"
              placeholder="اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="رقم القضية"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleStart}
              className="w-full py-2 bg-blue-600 text-white rounded"
            >
              {labels.startSession}
            </button>
            {saveFile && (
              <button
                onClick={handleSavePDF}
                className="w-full py-2 bg-green-600 text-white rounded"
              >
                PDF
              </button>
            )}
          </div>
        </div>
      ) : (
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
            <Environment preset="city" />
            <AutoRotateToJudge />
          </Suspense>
          <OrbitControls target={[-16, 1.2, -2]} enablePan enableZoom />
        </Canvas>
      )}
    </div>
  );
}
