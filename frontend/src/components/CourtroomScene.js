// src/CourtroomScene.js
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { io } from "socket.io-client";

const avatarsList = [
  { name: "Judge", path: "/avatars/judge.glb", position: [0, 0, 0] },
  { name: "Lawyer", path: "/avatars/lawyer.glb", position: [-2, 0, -1] },
  { name: "Witness", path: "/avatars/witness.glb", position: [2, 0, -1] },
];

const CourtroomScene = () => {
  const mountRef = useRef(null);
  const clock = new THREE.Clock();
  const [selectedAvatars, setSelectedAvatars] = useState(avatarsList);
  const mixersRef = useRef([]);
  const sceneRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // إعداد Socket.IO
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("update_avatar", (data) => {
      switchAvatar(data.index, data.newAvatar, false);
    });

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    light.position.set(0, 20, 0);
    scene.add(light);

    const loader = new GLTFLoader();
    mixersRef.current = [];

    const loadAvatar = (avatar) => {
      loader.load(avatar.path, (gltf) => {
        const model = gltf.scene;
        model.position.set(...avatar.position);
        scene.add(model);

        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
          mixersRef.current.push(mixer);
        }
      });
    };

    selectedAvatars.forEach(loadAvatar);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixersRef.current.forEach((m) => m.update(delta));
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      socketRef.current.disconnect();
    };
  }, []);

  const switchAvatar = (index, newAvatar, emit = true) => {
    setSelectedAvatars((prev) =>
      prev.map((av, i) => (i === index ? newAvatar : av))
    );
    if (emit) {
      socketRef.current.emit("switch_avatar", { index, newAvatar });
    }
  };

  return (
    <div>
      <div ref={mountRef} style={{ width: "100%", height: "80vh" }} />
      <div className="flex justify-center gap-4 mt-2">
        {selectedAvatars.map((avatar, i) => (
          <select
            key={i}
            value={avatar.name}
            onChange={(e) => {
              const chosen = avatarsList.find((a) => a.name === e.target.value);
              switchAvatar(i, chosen);
            }}
          >
            {avatarsList.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
};

export default CourtroomScene;
