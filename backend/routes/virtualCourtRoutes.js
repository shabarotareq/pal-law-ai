import express from "express";
import pool from "../db.js"; // اتصال PostgreSQL

const router = express.Router();

// حفظ الإعدادات
router.post("/settings", async (req, res) => {
  try {
    const { userId, botSpeed, language, showParticipants } = req.body;

    // تحديث أو إدخال جديد
    await pool.query(
      `INSERT INTO virtual_court_settings (user_id, bot_speed, language, show_participants)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET bot_speed = EXCLUDED.bot_speed,
                     language = EXCLUDED.language,
                     show_participants = EXCLUDED.show_participants`,
      [userId, botSpeed, language, showParticipants]
    );

    res.json({ success: true, message: "تم حفظ الإعدادات بنجاح ✅" });
  } catch (error) {
    console.error("❌ خطأ في حفظ الإعدادات:", error);
    res.status(500).json({ success: false, message: "فشل في حفظ الإعدادات" });
  }
});

export default router;
