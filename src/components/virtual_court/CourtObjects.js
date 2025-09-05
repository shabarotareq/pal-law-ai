import * as THREE from "three";

export function createCourtObjects(scene) {
  // أرضية
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshStandardMaterial({ color: 0xf3f4f6 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // منصة القاضي
  const bench = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.8, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x5b6373 })
  );
  bench.position.set(0, 0.4, -3.5);
  scene.add(bench);

  // طاولة الوسط
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x3b4252 })
  );
  table.position.set(0, 0.8, -1.6);
  scene.add(table);

  // مقاعد الحضور
  const publicBench = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.3, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x6b7280 })
  );
  publicBench.position.set(0, 0.15, 3);
  scene.add(publicBench);

  // صناديق للشاهد/المتهم
  [-2, 0, 2].forEach((x) => {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.7, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x9ca3af })
    );
    box.position.set(x, 0.35, -0.3);
    scene.add(box);
  });
}
