import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import useAuth from "../../hooks/useAuth";

// نموذج المحكمة
function CourtRoomModel() {
  const { scene } = useGLTF("/models/courtroom.glb");
  return <primitive object={scene} scale={1} />;
}

// نموذج شخصيات ثلاثية الأبعاد مع تحريك افتراضي
function AnimatedModel({
  path,
  position = [0, 0, 0],
  scale = 1,
  animationName,
  isAI = false,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const [mixer] = useState(() => new THREE.AnimationMixer());

  useFrame((state, delta) => mixer.update(delta));

  React.useEffect(() => {
    if (animations && animations.length > 0) {
      const clip =
        animations.find((a) => a.name === animationName) || animations[0];
      const action = mixer.clipAction(clip, group.current);
      action.play();
      if (isAI) action.setLoop(THREE.LoopRepeat);
    }
  }, [animations, animationName, isAI, mixer]);

  return (
    <primitive ref={group} object={scene} position={position} scale={scale} />
  );
}

// نموذج افتراضي للاعبين بدون نماذج
function FallbackModel({ type, position = [0, 0, 0], scale = 1 }) {
  const color = type === "judge" ? "gold" : type === "lawyer" ? "blue" : "red";
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
    </group>
  );
}

// المكون الرئيسي للمحكمة الافتراضية مع overlay
const VirtualCourtOverlay = ({
  lang = "ar",
  initialRole = "Witness",
  onClose,
}) => {
  const { user } = useAuth();
  const [role, setRole] = useState(user?.role || initialRole);
  const [players, setPlayers] = useState([
    { id: 1, name: "القاضي أحمد", role: "Judge", position: [0, 0, -2] },
    { id: 2, name: "المحامي محمد", role: "Lawyer", position: [-1.5, 0, 0] },
    {
      id: 3,
      name: "المدعى عليه خالد",
      role: "Defendant",
      position: [1.5, 0, 0],
    },
  ]);

  const controlsRef = useRef();

  const addPlayer = (newRole) => {
    const positions = {
      Judge: [0, 0, -2],
      Lawyer: [-1.5, 0, 0],
      Defendant: [1.5, 0, 0],
    };
    const newPlayer = {
      id: players.length + 1,
      name: `لاعب ${players.length + 1}`,
      role: newRole,
      position: positions[newRole],
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (id) => setPlayers(players.filter((p) => p.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      {/* الخلفية الشفافة والتدرج */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,50,0.8), rgba(50,0,50,0.8))",
        }}
        onClick={onClose}
      />

      {/* المحكمة الافتراضية */}
      <div className="relative w-full h-full">
        <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <CourtRoomModel />
            {players.map((player) => {
              const animationName =
                role.toLowerCase() === player.role.toLowerCase()
                  ? "talk"
                  : "idle";
              switch (player.role) {
                case "Judge":
                  return (
                    <AnimatedModel
                      key={player.id}
                      path="/models/avatar_judge.glb"
                      position={player.position}
                      scale={0.5}
                      animationName={animationName}
                      isAI={role !== "Judge"}
                    />
                  );
                case "Lawyer":
                  return (
                    <AnimatedModel
                      key={player.id}
                      path="/models/avatar_lawyer.glb"
                      position={player.position}
                      scale={0.5}
                      animationName={animationName}
                      isAI={role !== "Lawyer"}
                    />
                  );
                case "Defendant":
                  return (
                    <AnimatedModel
                      key={player.id}
                      path="/models/avatar_defendant.glb"
                      position={player.position}
                      scale={0.5}
                      animationName={animationName}
                      isAI={role !== "Defendant"}
                    />
                  );
                default:
                  return (
                    <FallbackModel
                      key={player.id}
                      type={player.role.toLowerCase()}
                      position={player.position}
                      scale={0.5}
                    />
                  );
              }
            })}
          </Suspense>
          <OrbitControls ref={controlsRef} enableZoom enablePan />
          <Environment preset="city" />
        </Canvas>

        {/* واجهة التحكم */}
        <Html fullscreen>
          <div
            className="absolute top-5 left-5 bg-black bg-opacity-50 text-white p-5 rounded-lg font-sans"
            style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-center text-lg font-bold">
                {lang === "ar" ? "المحكمة الافتراضية" : "Virtual Court"}
              </h3>
              <button onClick={onClose} className="text-xl font-bold">
                ✕
              </button>
            </div>

            {/* دور اللاعب */}
            <div className="mb-3">
              <h4>{lang === "ar" ? "دورك الحالي:" : "Your Role:"}</h4>
              <p
                className={`px-2 py-1 rounded text-center ${
                  role === "Judge"
                    ? "bg-yellow-400 text-black"
                    : role === "Lawyer"
                    ? "bg-blue-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {role === "Judge"
                  ? lang === "ar"
                    ? "قاضٍ"
                    : "Judge"
                  : role === "Lawyer"
                  ? lang === "ar"
                    ? "محامٍ"
                    : "Lawyer"
                  : lang === "ar"
                  ? "شاهد"
                  : "Witness"}
              </p>
            </div>

            {/* تغيير الدور */}
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setRole("Judge")}
                className={`px-3 py-1 rounded ${
                  role === "Judge"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                {lang === "ar" ? "قاضٍ" : "Judge"}
              </button>
              <button
                onClick={() => setRole("Lawyer")}
                className={`px-3 py-1 rounded ${
                  role === "Lawyer"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {lang === "ar" ? "محامٍ" : "Lawyer"}
              </button>
              <button
                onClick={() => setRole("Witness")}
                className={`px-3 py-1 rounded ${
                  role === "Witness"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {lang === "ar" ? "شاهد" : "Witness"}
              </button>
            </div>

            {/* إدارة اللاعبين */}
            <div className="mb-3 flex gap-2 flex-wrap">
              <button
                onClick={() => addPlayer("Judge")}
                className="px-2 py-1 bg-black text-yellow-400 rounded"
              >
                + {lang === "ar" ? "قاضٍ" : "Judge"}
              </button>
              <button
                onClick={() => addPlayer("Lawyer")}
                className="px-2 py-1 bg-black text-blue-400 rounded"
              >
                + {lang === "ar" ? "محامٍ" : "Lawyer"}
              </button>
              <button
                onClick={() => addPlayer("Defendant")}
                className="px-2 py-1 bg-black text-red-400 rounded"
              >
                + {lang === "ar" ? "مدعى عليه" : "Defendant"}
              </button>
            </div>

            {/* اللاعبين الحاليين */}
            <div className="max-h-36 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center mb-1 p-1 bg-gray-800 rounded text-sm"
                >
                  <span>{player.name}</span>
                  <span
                    className={`px-1 rounded text-xs ${
                      player.role === "Judge"
                        ? "bg-yellow-400 text-black"
                        : player.role === "Lawyer"
                        ? "bg-blue-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {player.role === "Judge"
                      ? lang === "ar"
                        ? "قاضٍ"
                        : "Judge"
                      : player.role === "Lawyer"
                      ? lang === "ar"
                        ? "محامٍ"
                        : "Lawyer"
                      : lang === "ar"
                      ? "مدعى عليه"
                      : "Defendant"}
                  </span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="px-1 bg-red-500 text-white rounded text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Html>
      </div>
    </div>
  );
};

// مكون VirtualCourt للعرض في Dashboard
const VirtualCourt = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">المحكمة الافتراضية</h2>
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-4">
          إدارة جلسات المحكمة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">الجلسات النشطة</h4>
            <p className="text-2xl font-bold text-green-600">5</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium mb-2">الجلسات المجدولة</h4>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
        </div>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          بدء جلسة جديدة
        </button>
      </div>
    </div>
  );
};

export { VirtualCourtOverlay, VirtualCourt };
