// src/components/virtual_court/CourtObjects.js
import * as THREE from "three";

export function createCourtObjects(scene) {
  // أرضية المحكمة
  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // طاولة القاضي
  const judgeTableGeometry = new THREE.BoxGeometry(2, 0.5, 1);
  const judgeTableMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
  });
  const judgeTable = new THREE.Mesh(judgeTableGeometry, judgeTableMaterial);
  judgeTable.position.set(0, 0.25, -3);
  scene.add(judgeTable);

  // منصة المدعي العام
  const prosecutorPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 1),
    new THREE.MeshStandardMaterial({ color: 0x4682b4 })
  );
  prosecutorPlatform.position.set(-2, 0.25, 0);
  scene.add(prosecutorPlatform);

  // منصة الدفاع
  const defensePlatform = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 1),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  defensePlatform.position.set(2, 0.25, 0);
  scene.add(defensePlatform);

  // منطقة الشاهد
  const witnessPlatform = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.5, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xffa500 })
  );
  witnessPlatform.position.set(0, 0.25, 1.5);
  scene.add(witnessPlatform);

  // مقاعد الحضور (صفين)
  const seatGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

  for (let row = 0; row < 2; row++) {
    for (let i = -3; i <= 3; i += 1.5) {
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.set(i, 0.25, row - 1.5);
      scene.add(seat);
    }
  }

  // إضاءة إضافية للتفاصيل
  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(5, 5, 5);
  spotLight.castShadow = true;
  scene.add(spotLight);
}
