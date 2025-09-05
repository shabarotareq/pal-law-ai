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
    if (animations.length > 0) {
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

// نموذج افتراضي للموظفين أو اللاعبين الغير موجودة نماذجهم
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

// المكون الرئيسي للمحكمة الافتراضية
export default function VirtualCourt({ initialRole = "Witness" }) {
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

  // إضافة لاعب جديد
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

  // إزالة لاعب
  const removePlayer = (id) => setPlayers(players.filter((p) => p.id !== id));

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <CourtRoomModel />

          {players.map((player) => {
            const animationName =
              role === player.role.toLowerCase() ? "talk" : "idle";
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
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            fontFamily: "Arial",
            direction: "rtl",
          }}
        >
          <h3 style={{ textAlign: "center" }}>المحكمة الافتراضية</h3>

          <div style={{ marginBottom: "15px" }}>
            <h4>دورك الحالي:</h4>
            <p
              style={{
                margin: 0,
                padding: "5px 10px",
                background:
                  role === "Judge"
                    ? "gold"
                    : role === "Lawyer"
                    ? "blue"
                    : "red",
                color: "white",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              {role === "Judge" ? "قاضٍ" : role === "Lawyer" ? "محامٍ" : "شاهد"}
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h4>تغيير الدور:</h4>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                onClick={() => setRole("Judge")}
                style={{
                  padding: "8px 12px",
                  background: role === "Judge" ? "gold" : "#555",
                  color: role === "Judge" ? "black" : "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                قاضٍ
              </button>
              <button
                onClick={() => setRole("Lawyer")}
                style={{
                  padding: "8px 12px",
                  background: role === "Lawyer" ? "blue" : "#555",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                محامٍ
              </button>
              <button
                onClick={() => setRole("Witness")}
                style={{
                  padding: "8px 12px",
                  background: role === "Witness" ? "red" : "#555",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                شاهد
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <h4>إدارة اللاعبين:</h4>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <button
                onClick={() => addPlayer("Judge")}
                style={{
                  padding: "5px 10px",
                  background: "#333",
                  color: "gold",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                إضافة قاضٍ
              </button>
              <button
                onClick={() => addPlayer("Lawyer")}
                style={{
                  padding: "5px 10px",
                  background: "#333",
                  color: "blue",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                إضافة محامٍ
              </button>
              <button
                onClick={() => addPlayer("Defendant")}
                style={{
                  padding: "5px 10px",
                  background: "#333",
                  color: "red",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                إضافة مدعى عليه
              </button>
            </div>
          </div>

          <div>
            <h4>اللاعبون الحاليون:</h4>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
              {players.map((player) => (
                <div
                  key={player.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px",
                    background: "#333",
                    borderRadius: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <span>{player.name}</span>
                  <span
                    style={{
                      padding: "2px 5px",
                      background:
                        player.role === "Judge"
                          ? "gold"
                          : player.role === "Lawyer"
                          ? "blue"
                          : "red",
                      color: player.role === "Judge" ? "black" : "white",
                      borderRadius: "3px",
                      fontSize: "12px",
                    }}
                  >
                    {player.role === "Judge"
                      ? "قاضٍ"
                      : player.role === "Lawyer"
                      ? "محامٍ"
                      : "مدعى عليه"}
                  </span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    style={{
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      padding: "2px 5px",
                    }}
                  >
                    إزالة
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </div>
  );
}
