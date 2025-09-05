import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { createCourtObjects } from "./CourtObjects";
import { AICharacter } from "../../ai/AICharacter";
import courtService from "../../services/court";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export default function VirtualCourt({ roomId = "main", currentUser }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const [role, setRole] = useState("attendee");

  const socketRef = useRef(null);
  const myId = useRef(currentUser?.id || uuidv4());
  const avatars = useRef(new Map()); // id -> mesh

  useGLTF("/models/courtroom.glb");
  useGLTF("/models/avatar_judge.glb");
  useGLTF("/models/avatar_lawyer.glb");
  useGLTF("/models/avatar_defendant.glb");

  useEffect(() => {
    // --- Three.js init
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe9edf5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);
    // زر الـ VR (WebXR)
    const vrButton = VRButton.createButton(renderer);
    vrButton.style.position = "fixed";
    vrButton.style.right = "16px";
    vrButton.style.bottom = "16px";
    document.body.appendChild(vrButton);

    // إضاءة
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 20, 0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(-3, 10, -10);
    scene.add(dir);

    // عناصر المحكمة
    createCourtObjects(scene);

    // تحكم للعرض المكتبي
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);
    controls.update();

    // أفاتار المستخدم المحلي
    const myAvatar = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.25, 1.0, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0x2b8bf2 })
    );
    myAvatar.position.set(0, 1.0, 2.8);
    myAvatar.userData.isLocal = true;
    scene.add(myAvatar);
    avatars.current.set(myId.current, myAvatar);

    // شخصية AI بسيطة
    const ai = new AICharacter({
      name: "AI Witness",
      position: new THREE.Vector3(1.2, 0, -0.3),
    });
    scene.add(ai.mesh);

    // حلقة الرسم
    renderer.setAnimationLoop(() => {
      ai.update();
      renderer.render(scene, camera);
    });

    // Resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      if (vrButton && vrButton.parentNode)
        vrButton.parentNode.removeChild(vrButton);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- Socket.IO (مزامنة جلسة المحكمة + تغيير الأدوار)
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { roomId, userId: myId.current, role });
    });

    socket.on("userJoined", ({ userId, role: userRole }) => {
      if (userId === myId.current) return;
      // أنشئ أفاتار بسيط للمستخدمين الآخرين
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

    socket.on("roleChanged", ({ userId, newRole }) => {
      if (userId === myId.current) setRole(newRole);
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

  const askAIWitness = async () => {
    const { answer } = await courtService.askAI({
      question: "اشرح بإيجاز شهادتك بلهجة رسمية.",
      context: "جلسة محكمة؛ شاهد ذكي؛ إجابة مختصرة.",
    });
    alert(answer);
  };

  return (
    <div className="virtual-court">
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
      {/* HUD */}
      <div style={{ position: "fixed", top: 16, left: 16, zIndex: 1000 }}>
        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,.1)",
          }}
        >
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
            <button onClick={askAIWitness}>اسأل الشاهد (AI)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
