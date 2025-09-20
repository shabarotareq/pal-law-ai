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

//
// 🎭 مكون شخصية عامة
//
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
      if (!label.includes("القاضي")) {
        ref.current.lookAt(new THREE.Vector3(-16, 1.2, -2));
      }
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

//
// 🪵 أرضية المحكمة
//
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

//
// 🏛️ نموذج المحكمة
//
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

//
// 🎥 تدوير الكاميرا على القاضي
//
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

//
// 📌 الملف الرئيسي VirtualCourt
//
export default function VirtualCourt() {
  const router = useRouter();

  // الشاشات: menu → settings → court
  const [screen, setScreen] = useState("menu");

  // إعدادات المحكمة
  const [name, setName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [colleagues, setColleagues] = useState(["أحمد", "سارة"]);
  const [newColleague, setNewColleague] = useState("");

  //
  // 🎛️ القائمة الرئيسية (MainMenu)
  //
  if (screen === "menu") {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen text-white bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 p-4">
        <h1 className="text-4xl font-bold mb-8">🏛️ المحكمة الافتراضية</h1>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setScreen("settings")}
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
      </div>
    );
  }

  //
  // 📝 شاشة إعدادات الجلسة
  //
  if (screen === "settings") {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-gray-800">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
          <h1 className="text-2xl font-bold">إعدادات المحكمة</h1>
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
            onClick={() => {
              if (!name || !caseNumber) {
                alert("املأ جميع الحقول");
                return;
              }
              setColleagues([{ name, caseNumber }, ...colleagues]);
              setScreen("court");
            }}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            دخول الجلسة
          </button>
        </div>
      </div>
    );
  }

  //
  // 🏛️ شاشة المحكمة الافتراضية
  //
  if (screen === "court") {
    return (
      <Canvas shadows camera={{ position: [-28, 6, 7], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 15, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <TexturedFloor />
          <CourtroomModel />
          <Character modelPath="/models/judge.glb" scale={1.2} label="القاضي" />
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
              />
            );
          })}

          <Environment preset="city" />
          <AutoRotateToJudge />
        </Suspense>
        <OrbitControls target={[-16, 1.2, -2]} enablePan enableZoom />
      </Canvas>
    );
  }

  return null;
}
