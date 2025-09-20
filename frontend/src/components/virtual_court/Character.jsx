import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { useCourtStore } from "../../store/useCourtStore";

export default function Character({
  id,
  role,
  position = [0, 0, 0],
  isCurrentPlayer,
  socket,
}) {
  const { courtProtocol, addLog } = useCourtStore();
  const { scene } = useGLTF(`/models/${role}.glb`);
  const ref = useRef();
  const [pos, setPos] = useState(new THREE.Vector3(...position));
  const [isStanding, setIsStanding] = useState(false);
  const clockRef = useRef(0);

  useFrame((_, delta) => {
    clockRef.current += delta;
    if (ref.current) {
      const breathing = Math.sin(clockRef.current * 2) * 0.03;
      const standingOffset = isStanding ? 1.2 : 0;
      ref.current.position.set(
        pos.x,
        pos.y + breathing + standingOffset,
        pos.z
      );
      ref.current.rotation.y = Math.sin(clockRef.current * 0.5) * 0.1;
    }
  });

  const move = useCallback(
    (dx, dz) => {
      if (!isCurrentPlayer && role !== "judge") return;
      const newPos = new THREE.Vector3(pos.x + dx, pos.y, pos.z + dz);
      setPos(newPos);
      socket?.emit("move", { id, pos: newPos });
    },
    [id, pos, isCurrentPlayer, role, socket]
  );

  useEffect(() => {
    if (courtProtocol.standing !== isStanding) {
      setIsStanding(courtProtocol.standing);
      addLog(`${role} ${courtProtocol.standing ? "وقف" : "جلس"}`);
    }
  }, [courtProtocol.standing, isStanding, role, addLog]);

  return (
    <group>
      <primitive ref={ref} object={scene} scale={1.2} />
      {(isCurrentPlayer || role === "judge") && (
        <Html position={[pos.x, pos.y + 2.5, pos.z]} center distanceFactor={8}>
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              color: "#fff",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
              {role}
            </div>
            <div>
              <button onClick={() => move(0, -0.3)}>⬆</button>
              <button onClick={() => move(-0.3, 0)}>⬅</button>
              <button onClick={() => move(0.3, 0)}>➡</button>
              <button onClick={() => move(0, 0.3)}>⬇</button>
            </div>
            {role === "judge" && (
              <div>
                <button
                  onClick={() =>
                    socket.emit("protocolAction", {
                      action: "stand",
                      targetRole: "all",
                    })
                  }
                >
                  {courtProtocol.standing ? "اجلسوا" : "قفوا"}
                </button>
                <button
                  onClick={() =>
                    socket.emit("protocolAction", {
                      action: "sessionStart",
                      targetRole: "all",
                    })
                  }
                >
                  {courtProtocol.sessionActive ? "إنهاء الجلسة" : "بدء الجلسة"}
                </button>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/models/judge.glb");
useGLTF.preload("/models/lawyer.glb");
useGLTF.preload("/models/witness.glb");
