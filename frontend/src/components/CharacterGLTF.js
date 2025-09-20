// frontend/components/CharacterGLTF.js
import React, { useRef, useEffect, useState } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CharacterGLTF({
  modelPath,
  position = [0, 0, 0],
  scale = 1,
  label,
}) {
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

    // وضع خاص للقاضي
    if (label === "القاضي") {
      const judgePos = new THREE.Vector3(-16, 1.2, -2);
      setPos(judgePos);
      if (ref.current) {
        ref.current.position.copy(judgePos);
        ref.current.rotation.set(0, Math.PI / 2, 0);
      }
    }
  }, [scene, label]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(pos.x, pos.y, pos.z);
      if (label !== "القاضي") {
        ref.current.lookAt(new THREE.Vector3(-16, 1.2, -2));
      }
    }
  });

  return (
    <group>
      <primitive ref={ref} object={scene} scale={scale} />
      <Html position={[pos.x, pos.y + 2, pos.z]} center>
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {label}
        </div>
      </Html>
    </group>
  );
}
