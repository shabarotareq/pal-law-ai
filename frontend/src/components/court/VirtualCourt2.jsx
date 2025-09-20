"use client";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="saddlebrown" />
    </mesh>
  );
}

function Character({ position, color, label }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={color} />
      {/* لابل بسيط فوق الرأس */}
      <mesh position={[0, 1.5, 0]}>
        <planeGeometry args={[2, 0.7]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </mesh>
  );
}

export default function VirtualCourtPage() {
  const [showSettings, setShowSettings] = useState(true);
  const [name, setName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");

  const handleStart = () => {
    if (!name || !caseNumber) {
      alert("املأ جميع الحقول");
      return;
    }
    setShowSettings(false);
  };

  return (
    <div className="w-screen h-screen">
      {showSettings ? (
        <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <h1 className="text-2xl font-bold">المحكمة الافتراضية</h1>
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
              دخول الجلسة
            </button>
          </div>
        </div>
      ) : (
        <Canvas shadows camera={{ position: [5, 5, 10], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Suspense fallback={null}>
            <Floor />
            {/* شخصيات افتراضية */}
            <Character position={[0, 1, 0]} color="red" label="القاضي" />
            <Character position={[-3, 1, 2]} color="blue" label="المحامي" />
            <Character position={[3, 1, 2]} color="green" label="الشاهد" />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
}
