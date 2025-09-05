import * as THREE from "three";

export class AICharacter {
  constructor({ name = "AI", position = new THREE.Vector3() } = {}) {
    this.name = name;
    this.mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.25, 1.0, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xff8a65 })
    );
    this.mesh.position.copy(position);
    this._tick = 0;
  }

  async _askBackend(context = "") {
    try {
      const resp = await fetch("/api/ai/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `قرار حركة قصير داخل قاعة المحكمة: ${context}`,
          context: "courtroom",
        }),
      });
      const data = await resp.json();
      return data?.answer || "";
    } catch {
      return "";
    }
  }

  async update() {
    this._tick++;
    if (this._tick % 180 === 0) {
      const action = await this._askBackend(this.name);
      if (action.includes("تقدم") || action.includes("approach")) {
        this.mesh.position.z -= 0.25;
      } else {
        this.mesh.position.x += (Math.random() - 0.5) * 0.05;
        this.mesh.position.z += (Math.random() - 0.5) * 0.05;
      }
    } else {
      this.mesh.position.x += (Math.random() - 0.5) * 0.01;
      this.mesh.position.z += (Math.random() - 0.5) * 0.01;
    }
  }
}
