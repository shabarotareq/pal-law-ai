// src/ai/AICharacter.js
import * as THREE from "three";
import OpenAI from "openai";

export class AICharacter {
  constructor(name) {
    this.name = name;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1.7, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    this.position = new THREE.Vector3(Math.random() * 2, 0, Math.random() * 2);
    this.mesh.position.copy(this.position);

    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async decideAction(context) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a courtroom AI character." },
        { role: "user", content: `Courtroom context: ${context}` },
      ],
      max_tokens: 50,
    });
    return response.choices[0].message.content;
  }

  update() {
    // Example: random movement or AI decision
    this.mesh.position.x += (Math.random() - 0.5) * 0.01;
    this.mesh.position.z += (Math.random() - 0.5) * 0.01;
  }
}
