import express from "express";
import fs from "fs";
import path from "path";

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { chat } = require("../controllers/chatbotController");
router.post("/", auth, chat);
module.exports = router;

const mappingPath = path.join(process.cwd(), "backend/data/lawsMapping.json");
const mapping = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));

// مثال: المستخدم يسأل عن مادة
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  // البحث في JSON
  const foundKey = Object.keys(mapping).find((key) => message.includes(key));

  if (foundKey) {
    return res.json({
      reply: `🔗 يمكنك قراءة ${foundKey} من هنا: ${mapping[foundKey]}`,
    });
  }

  // الرد الافتراضي من الـ AI
  return res.json({
    reply: "❓ لم أجد المادة المطلوبة، هل يمكنك توضيح أكثر؟",
  });
});

export default router;
