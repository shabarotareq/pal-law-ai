import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { createCourtObjects } from "./CourtObjects";
import AICharacter, { getAIInstance } from "../../ai/AICharacter";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export default function VirtualCourt({
  roomId = "main",
  currentUser,
  onClose,
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const [role, setRole] = useState("attendee");
  const [aiService, setAiService] = useState(null);
  const [aiError, setAiError] = useState("");

  const socketRef = useRef(null);
  const myId = useRef(currentUser?.id || uuidv4());
  const avatars = useRef(new Map());
  const aiWitnessRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const cleanupRef = useRef(null); // إضافة ref لحفظ وظائف التنظيف

  // تهيئة خدمة الذكاء الاصطناعي
  useEffect(() => {
    try {
      const aiCharacter = getAIInstance();
      setAiService(aiCharacter);

      if (!aiCharacter.checkAvailability()) {
        setAiError("خدمة الذكاء الاصطناعي غير متاحة. يرجى إعداد مفتاح API.");
      }
    } catch (error) {
      setAiError("فشل في تهيئة خدمة الذكاء الاصطناعي");
      console.error("AI initialization failed:", error);
    }
  }, []);

  // تهيئة المشهد ثلاثي الأبعاد
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe9edf5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // VR Button
    const vrButton = VRButton.createButton(renderer);
    document.body.appendChild(vrButton);

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 20, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(-3, 10, -10);
    scene.add(dir);

    // Court Objects
    createCourtObjects(scene);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);
    controls.update();

    // Local Avatar
    const myAvatar = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.25, 1.0, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x2b8bf2 })
    );
    myAvatar.position.set(0, 1.0, 2.8);
    myAvatar.userData.isLocal = true;
    scene.add(myAvatar);
    avatars.current.set(myId.current, myAvatar);

    // AI Witness (إذا كانت الخدمة متاحة)
    if (aiService && aiService.isAvailable) {
      const aiWitness = new AICharacter({
        name: "AI Witness",
        position: new THREE.Vector3(1.2, 0, -0.3),
      });

      // إضافة دالة update إذا لم تكن موجودة
      if (typeof aiWitness.update !== "function") {
        aiWitness.update = function (deltaTime) {
          // دالة تحديث افتراضية للتحريك
          if (this.mixer) {
            this.mixer.update(deltaTime);
          }
          // يمكن إضافة منطق تحريك إضافي هنا
        };
      }

      scene.add(aiWitness.mesh);
      aiWitnessRef.current = aiWitness;
    }

    // Render loop
    const animate = () => {
      const deltaTime = clockRef.current.getDelta();

      // تحديث AI Witness إذا كان موجوداً
      if (
        aiWitnessRef.current &&
        typeof aiWitnessRef.current.update === "function"
      ) {
        aiWitnessRef.current.update(deltaTime);
      }

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // حفظ وظيفة التنظيف للاستخدام لاحقاً
    cleanupRef.current = () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (vrButton && vrButton.parentNode) {
        vrButton.parentNode.removeChild(vrButton);
      }
      // تنظيف المشهد
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }
      renderer.dispose();
    };

    return cleanupRef.current;
  }, [aiService]);

  // Socket.IO
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { roomId, userId: myId.current, role });
    });

    socket.on("userJoined", ({ userId }) => {
      if (userId === myId.current) return;
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.25, 1.0, 6, 12),
        new THREE.MeshStandardMaterial({ color: 0x8a2be2 })
      );
      mesh.position.set(
        (Math.random() - 0.5) * 4,
        1.0,
        (Math.random() - 0.5) * 4
      );
      sceneRef.current.add(mesh);
      avatars.current.set(userId, mesh);
    });

    socket.on("userMove", ({ id, pos }) => {
      const m = avatars.current.get(id);
      if (m) m.position.set(pos.x, pos.y, pos.z);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, role]);

  const changeRole = (newRole) => {
    setRole(newRole);
    socketRef.current?.emit("changeRole", {
      roomId,
      userId: myId.current,
      newRole,
    });
  };

  const nudgeForward = () => {
    const me = avatars.current.get(myId.current);
    if (me) {
      me.position.z -= 0.15;
      socketRef.current?.emit("userMove", {
        roomId,
        id: myId.current,
        pos: { x: me.position.x, y: me.position.y, z: me.position.z },
      });
    }
  };

  const handleAIAction = async (prompt) => {
    if (!aiService || !aiService.isAvailable) {
      alert("خدمة الذكاء الاصطناعي غير متاحة حالياً");
      return;
    }

    try {
      const response = await aiService.generateResponse(prompt);
      // معالجة الاستجابة
      console.log("AI Response:", response);
    } catch (error) {
      console.error("AI action failed:", error);
    }
  };

  // دالة الإغلاق المحسنة
  const handleClose = () => {
    // تنظيف Three.js
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    // قطع اتصال Socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // استدعاء دالة الإغلاق الأصلية
    if (onClose) {
      onClose();
    }

    console.log("✅ Virtual Court closed successfully");
  };

  return (
    <div className="virtual-court">
      {/* زر الإغلاق - تم تحديثه لاستدعاء handleClose */}
      <button
        className="absolute top-4 right-4 text-white text-xl z-50 bg-red-600 rounded-full w-10 h-10 flex items-center justify-center"
        onClick={handleClose} // تم التغيير هنا
      >
        ✕
      </button>

      {/* رسائل الخطأ */}
      {aiError && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 z-50 max-w-md">
          <p>{aiError}</p>
        </div>
      )}

      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />

      {/* واجهة التحكم */}
      <div style={{ position: "fixed", top: 16, left: 16, zIndex: 1000 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div>
            دورك الحالي: <b>{role}</b>
          </div>
          <div
            style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <button onClick={() => changeRole("judge")}>قاضٍ</button>
            <button onClick={() => changeRole("prosecutor")}>مدعٍ عام</button>
            <button onClick={() => changeRole("defense")}>محامي دفاع</button>
            <button onClick={() => changeRole("defendant")}>متهم</button>
            <button onClick={() => changeRole("witness")}>شاهد</button>
            <button onClick={nudgeForward}>تحرك للأمام</button>

            {/* زر لاختبار الذكاء الاصطناعي */}
            {aiService && aiService.isAvailable && (
              <button
                onClick={() =>
                  handleAIAction("مرحباً، كيف يمكنك المساعدة في الجلسة؟")
                }
              >
                اسأل الذكاء الاصطناعي
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
