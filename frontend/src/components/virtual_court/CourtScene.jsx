import React from "react";

export default function CourtScene() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.3, -5]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.6, 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      <mesh position={[0, 0.8, -4]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      <mesh position={[0, 3, -10]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
    </>
  );
}
