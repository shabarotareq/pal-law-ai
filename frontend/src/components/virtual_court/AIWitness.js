// src/components/virtual_court/AIWitness.js
import * as THREE from "three";
import { getAIInstance } from "../../ai/AICharacter";
import { CanvasTexture, MeshBasicMaterial, Mesh, PlaneGeometry } from "three";

export default class AIWitness {
  constructor(position = new THREE.Vector3(1.2, 1.0, -0.3)) {
    this.aiService = getAIInstance();
    this.mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.25, 1.0, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xffa500 })
    );
    this.mesh.position.copy(position);

    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext("2d");

    this.texture = new CanvasTexture(this.canvas);
    const material = new MeshBasicMaterial({
      map: this.texture,
      transparent: true,
    });
    const geometry = new PlaneGeometry(2, 1);
    this.speechBubble = new Mesh(geometry, material);
    this.speechBubble.position.set(0, 1.5, 0);
    this.mesh.add(this.speechBubble);

    this.messages = [];
    this.maxMessages = 3;
    this.messageDuration = 5000;
    this.floatOffset = 0;
    this.floatSpeed = 1.5;
    this.floatAmplitude = 0.05;

    this.updateBubble();
  }

  update(deltaTime) {
    this.floatOffset += deltaTime * this.floatSpeed;
    this.speechBubble.position.y =
      1.5 + Math.sin(this.floatOffset) * this.floatAmplitude;

    const now = Date.now();
    this.messages = this.messages.filter(
      (msg) => now - msg.timestamp < this.messageDuration
    );
    this.updateBubble();
  }

  addMessage(text) {
    this.messages.push({ text, timestamp: Date.now() });
    this.updateBubble();
  }

  updateBubble() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const now = Date.now();
    const lineHeight = 32;
    const startY = 20;

    this.messages.slice(-this.maxMessages).forEach((msg, idx) => {
      const alpha = 1 - (now - msg.timestamp) / this.messageDuration;
      ctx.globalAlpha = Math.max(alpha, 0);

      const words = msg.text.split(" ");
      const lines = [];
      let line = "";
      const maxWidth = canvas.width - 40;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else line = testLine;
      }
      lines.push(line);

      lines.forEach((l, i) => {
        ctx.fillText(
          l.trim(),
          canvas.width / 2,
          startY + (idx * lines.length + i) * lineHeight
        );
      });

      ctx.globalAlpha = 1;
    });

    this.texture.needsUpdate = true;
  }

  async ask(prompt) {
    if (!this.aiService || !this.aiService.isAvailable) {
      this.addMessage("⚠️ خدمة الذكاء الاصطناعي غير متاحة.");
      return "⚠️ غير متاحة";
    }

    try {
      const response = await this.aiService.generateResponse(prompt);
      this.addMessage(response);
      return response;
    } catch {
      this.addMessage("❌ حدث خطأ أثناء التواصل مع الشاهد الافتراضي.");
      return "❌ خطأ";
    }
  }
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};
