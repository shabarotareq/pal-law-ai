import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  Sky,
} from "@react-three/drei";
import * as THREE from "three";
import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

// 🎭 مكون الشخصية
function Character({
  id,
  modelPath,
  position = [0, 0, 0],
  scale = 1,
  label,
  role: characterRole,
  name,
  onMove,
  addLog,
  isCurrentPlayer = false,
  isJudge = false,
  courtProtocol,
  onProtocolAction,
}) {
  // استخدام useGLTF بشكل صحيح - يجب أن يكون دائمًا في أعلى المكون
  const { scene } = useGLTF(modelPath);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);

  // تحميل النموذج بشكل آمن
  useEffect(() => {
    try {
      if (scene && typeof scene === "object") {
        setModelLoaded(true);
        addLog(`✅ تم تحميل النموذج: ${modelPath.split("/").pop()}`);
      } else {
        throw new Error("النموذج غير صالح");
      }
    } catch (err) {
      setModelError(true);
      addLog(`❌ فشل تحميل النموذج: ${modelPath}`);
      console.error("خطأ في تحميل النموذج:", err);
    }
  }, [scene, modelPath, addLog]);

  const ref = useRef();
  const [pos, setPos] = useState(new THREE.Vector3(...position));
  const [isStanding, setIsStanding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const clockRef = useRef(0);

  // 🎬 حركة Idle متقدمة مع استجابة لأوامر المحكمة
  useFrame((_, delta) => {
    clockRef.current += delta;
    if (ref.current && modelLoaded && !modelError) {
      // حركة تنفس طبيعية
      const breathing = Math.sin(clockRef.current * 2) * 0.03;

      // ارتفاع الوقوف أو الجلوس بناء على بروتوكول المحكمة
      const standingHeight = isStanding ? 1.2 : 0;

      ref.current.position.y = pos.y + breathing + standingHeight;

      // حركة رأس وتمايل طبيعي
      ref.current.rotation.y = Math.sin(clockRef.current * 0.8) * 0.15;
      ref.current.rotation.z = Math.sin(clockRef.current * 1.2) * 0.02;

      // تأثير التحدث (اهتزاز خفيف)
      if (isSpeaking) {
        ref.current.rotation.x = Math.sin(clockRef.current * 5) * 0.05;
      }

      // تحديث الموضع الأساسي
      ref.current.position.x = pos.x;
      ref.current.position.z = pos.z;
    }
  });

  const move = useCallback(
    (dx, dz) => {
      // القاضي فقط يمكنه التحرك بحرية
      if (!isCurrentPlayer && !isJudge) return;

      setPos((prev) => {
        const newPos = new THREE.Vector3(prev.x + dx, prev.y, prev.z + dz);
        if (onMove) onMove(id, newPos);
        return newPos;
      });
    },
    [id, onMove, isCurrentPlayer, isJudge]
  );

  // استجابة لأوامر بروتوكول المحكمة
  useEffect(() => {
    if (courtProtocol.standing && !isStanding) {
      setIsStanding(true);
      addLog(`👤 ${label} (${name}) يقف احتراماً للمحكمة`);
    } else if (!courtProtocol.standing && isStanding) {
      setIsStanding(false);
      addLog(`👤 ${label} (${name}) يجلس`);
    }
  }, [courtProtocol.standing, isStanding, label, name, addLog]);

  const handleProtocolAction = (action) => {
    if (onProtocolAction) {
      onProtocolAction(action, characterRole);
    }
  };

  // إذا فشل تحميل النموذج، عرض بديل
  if (modelError) {
    return (
      <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <Html position={[0, 1.5, 0]} center>
          <div
            style={{
              color: "white",
              background: "rgba(0,0,0,0.7)",
              padding: "4px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            ❌ {label} ({name})
          </div>
        </Html>
      </mesh>
    );
  }

  // إذا لم يتم تحميل النموذج بعد، عرض مؤشر تحميل
  if (!modelLoaded) {
    return (
      <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
        <Html position={[0, 1.5, 0]} center>
          <div
            style={{
              color: "white",
              background: "rgba(0,0,0,0.7)",
              padding: "4px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            ⏳ جاري التحميل...
          </div>
        </Html>
      </mesh>
    );
  }

  return (
    <group>
      <primitive
        ref={ref}
        object={scene}
        scale={scale}
        castShadow
        receiveShadow
      />

      {/* 🎪 واجهة التحكم بالشخصية (لللاعب الحالي فقط أو القاضي) */}
      {(isCurrentPlayer || isJudge) && (
        <Html position={[pos.x, pos.y + 2.5, pos.z]} center distanceFactor={8}>
          <div
            style={{
              background: "rgba(0,0,0,0.9)",
              color: "#fff",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "14px",
              border: `2px solid ${isJudge ? "#FFD700" : "#4CAF50"}`,
              backdropFilter: "blur(4px)",
              minWidth: "140px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: isJudge ? "#FFD700" : "#4CAF50",
              }}
            >
              {label} ({name}) {isJudge && "👑"}
            </div>

            {/* أزرار الحركة (للقاضي أو اللاعب الحالي فقط) */}
            {(isCurrentPlayer || isJudge) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                <button
                  onClick={() => move(0, -0.3)}
                  style={{
                    padding: "6px",
                    background: "#4CAF50",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    gridColumn: "2",
                  }}
                >
                  ⬆
                </button>
                <button
                  onClick={() => move(-0.3, 0)}
                  style={{
                    padding: "6px",
                    background: "#2196F3",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ⬅
                </button>
                <button
                  onClick={() => move(0.3, 0)}
                  style={{
                    padding: "6px",
                    background: "#2196F3",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ➡
                </button>
                <button
                  onClick={() => move(0, 0.3)}
                  style={{
                    padding: "6px",
                    background: "#FF9800",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    gridColumn: "2",
                  }}
                >
                  ⬇
                </button>
              </div>
            )}

            {/* أوامر البروتوكول (للقاضي فقط) */}
            {isJudge && (
              <div
                style={{
                  marginTop: "8px",
                  borderTop: "1px solid #444",
                  paddingTop: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    marginBottom: "4px",
                    color: "#FFD700",
                  }}
                >
                  أوامر المحكمة:
                </div>
                <button
                  onClick={() => handleProtocolAction("stand")}
                  style={{
                    padding: "4px 6px",
                    background: courtProtocol.standing ? "#4CAF50" : "#666",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "10px",
                    margin: "2px",
                    width: "100%",
                  }}
                >
                  {courtProtocol.standing ? "الجلوس" : "الوقوف"}
                </button>
                <button
                  onClick={() => handleProtocolAction("sessionStart")}
                  style={{
                    padding: "4px 6px",
                    background: courtProtocol.sessionActive
                      ? "#4CAF50"
                      : "#f44336",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "10px",
                    margin: "2px",
                    width: "100%",
                  }}
                >
                  {courtProtocol.sessionActive ? "إنهاء الجلسة" : "بدء الجلسة"}
                </button>
              </div>
            )}

            {/* حالة البروتوكول */}
            <div
              style={{
                fontSize: "10px",
                marginTop: "8px",
                padding: "4px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "4px",
              }}
            >
              {courtProtocol.standing ? "🟢 واقف" : "🔵 جالس"} |
              {courtProtocol.sessionActive
                ? " 🟢 جلسة نشطة"
                : " 🔴 جلسة متوقفة"}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// 🏛️ أرضية المحكمة
function CourtFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 50, 50]} />
      <meshStandardMaterial color="#808080" roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

// 🪑 أثاث المحكمة
function CourtFurniture() {
  return (
    <>
      <mesh position={[0, 0.3, -5]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.6, 2]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.8, -4]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#A0522D" roughness={0.6} />
      </mesh>
      <group position={[0, 0, 8]}>
        {[-3, -1.5, 0, 1.5, 3].map((x) => (
          <mesh key={x} position={[x, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1, 0.8, 0.8]} />
            <meshStandardMaterial color="#CD853F" roughness={0.5} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.4, 16]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.6} />
      </mesh>
    </>
  );
}

// 🏢 جدران المحكمة
function CourtWalls() {
  return (
    <>
      <mesh position={[0, 3, -10]} rotation={[0, 0, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
      </mesh>
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
      </mesh>
      <mesh position={[15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
      </mesh>
    </>
  );
}

// ⚡ تحميل مسبق للنماذج
useGLTF.preload("/models/judge.glb");
useGLTF.preload("/models/lawyer.glb");
useGLTF.preload("/models/witness.glb");

// لوحة إعدادات المحكمة
function CourtSettings({ onStart, takenRoles }) {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [courtMain, setCourtMain] = useState("");
  const [courtSub, setCourtSub] = useState("");
  const [city, setCity] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [showSettings, setShowSettings] = useState(true);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setShowSettings(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isFormValid =
    role &&
    name &&
    courtMain &&
    ((courtMain === "صلاح" && courtSub) || courtMain !== "صلاح") &&
    city &&
    caseNumber &&
    sessionDate &&
    sessionTime &&
    !takenRoles.includes(role);

  if (!showSettings) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #2c3e50, #34495e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        zIndex: 9999,
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.85)",
          padding: "30px",
          borderRadius: "20px",
          minWidth: "320px",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px", fontSize: "2rem" }}>
          🏛️ المحكمة الافتراضية
        </h1>
        <p style={{ marginBottom: "15px" }}>
          منصة تفاعلية لمحاكاة جلسات المحكمة
        </p>
        <p style={{ marginBottom: "25px" }}>
          تجربة ثلاثية الأبعاد مع مشاركة متعددة اللاعبين
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            اختر الدور:
          </label>
          {[
            { r: "judge", label: "القاضي", color: "#FFD700" },
            { r: "lawyer", label: "المحامي", color: "#4CAF50" },
            { r: "witness", label: "الشاهد", color: "#2196F3" },
          ].map(({ r, label, color }) => (
            <button
              key={r}
              disabled={takenRoles.includes(r)}
              onClick={() => setRole(r)}
              style={{
                background: role === r ? color : "rgba(255,255,255,0.1)",
                color: role === r ? "#000" : "#fff",
                margin: "5px",
                padding: "10px 15px",
                borderRadius: "10px",
                cursor: takenRoles.includes(r) ? "not-allowed" : "pointer",
                border: `2px solid ${color}`,
                width: "100%",
              }}
            >
              {label} {takenRoles.includes(r) ? "(محجوز)" : ""}
            </button>
          ))}
        </div>

        {role && (
          <>
            <input
              placeholder={`أدخل اسم ${role}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "none",
              }}
            />
            <select
              value={courtMain}
              onChange={(e) => setCourtMain(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <option value="">اختر المحكمة</option>
              <option value="صلاح">محكمة الصلح</option>
              <option value="شرعية">المحكمة الشرعية</option>
              <option value="عليا">المحكمة العليا</option>
            </select>
            {courtMain === "صلاح" && (
              <select
                value={courtSub}
                onChange={(e) => setCourtSub(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                }}
              >
                <option value="">اختر فرع المحكمة</option>
                <option value="بداية">محكمة البداية</option>
                <option value="استئناف">محكمة الاستئناف</option>
                <option value="نقض">محكمة النقض</option>
              </select>
            )}
            <input
              placeholder="اسم المدينة"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "none",
              }}
            />
            <input
              placeholder="رقم القضية"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "none",
              }}
            />
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "none",
                marginRight: "4%",
              }}
            />
            <input
              type="time"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              style={{
                width: "48%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "none",
              }}
            />

            <button
              onClick={() =>
                onStart({
                  role,
                  name,
                  court: courtMain,
                  subCourt: courtSub,
                  city,
                  caseNumber,
                  sessionDate,
                  sessionTime,
                })
              }
              disabled={!isFormValid}
              style={{
                padding: "10px 20px",
                background: isFormValid ? "#4CAF50" : "#666",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: isFormValid ? "pointer" : "not-allowed",
                marginTop: "10px",
                width: "100%",
              }}
            >
              متابعة
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ✨ المحكمة الافتراضية
export default function VirtualCourt() {
  const [playerId] = useState(() => crypto.randomUUID());
  const [roleInfo, setRoleInfo] = useState(null);
  const [players, setPlayers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [courtProtocol, setCourtProtocol] = useState({
    standing: false,
    sessionActive: false,
    currentSpeaker: null,
  });
  const socketRef = useRef();

  const addLog = useCallback((msg) => {
    setLogs((prev) => [
      ...prev.slice(-9),
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
    console.log(msg);
  }, []);

  const handleStart = (roleData) => {
    setRoleInfo(roleData);
    // إذا القاضي يختاره المستخدم فعّل الجلسة مباشرة
    if (roleData.role === "judge") {
      setCourtProtocol((prev) => ({ ...prev, sessionActive: true }));
    }
  };

  // 🌐 Socket.IO
  useEffect(() => {
    if (!roleInfo) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      addLog(`✅ متصل بالخادم كـ ${roleInfo.role}`);
      socket.emit("joinRoom", { id: playerId, ...roleInfo });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      addLog("❌ انقطع الاتصال بالخادم");
    });

    socket.on("updatePlayers", (data) => setPlayers(data));

    socket.on("playerMoved", ({ id, pos }) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, position: pos } : p))
      );
    });

    socket.on("courtProtocolUpdate", (protocol) => setCourtProtocol(protocol));

    return () => socket.disconnect();
  }, [roleInfo, playerId, addLog]);

  const handleMove = useCallback(
    (id, pos) => {
      if (id === playerId || roleInfo?.role === "judge")
        socketRef.current?.emit("move", { id, pos });
    },
    [roleInfo, playerId]
  );

  const handleProtocolAction = useCallback(
    (action, targetRole) => {
      if (roleInfo?.role === "judge") {
        socketRef.current?.emit("protocolAction", { action, targetRole });
        addLog(`⚖️ إصدار أمر بروتوكول: ${action} للدور ${targetRole}`);
      }
    },
    [roleInfo, addLog]
  );

  if (!roleInfo)
    return (
      <CourtSettings
        onStart={handleStart}
        takenRoles={players.map((p) => p.role)}
      />
    );

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 3, 10], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <Sky sunPosition={[10, 20, 10]} />
        <Suspense
          fallback={
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#ff6b6b" />
            </mesh>
          }
        >
          <CourtFloor />
          <CourtWalls />
          <CourtFurniture />
          {players.map((p) => (
            <Character
              key={p.id}
              id={p.id}
              modelPath={
                p.role === "judge"
                  ? "/models/judge.glb"
                  : p.role === "lawyer"
                  ? "/models/lawyer.glb"
                  : "/models/witness.glb"
              }
              position={p.position || [0, 0, 0]}
              scale={1.2}
              label={
                p.role === "judge"
                  ? "القاضي"
                  : p.role === "lawyer"
                  ? "المحامي"
                  : "الشاهد"
              }
              name={p.name}
              role={p.role}
              onMove={handleMove}
              addLog={addLog}
              isCurrentPlayer={p.id === playerId}
              isJudge={p.role === "judge"}
              courtProtocol={courtProtocol}
              onProtocolAction={handleProtocolAction}
            />
          ))}
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
