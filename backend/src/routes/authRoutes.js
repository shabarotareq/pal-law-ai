const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// تسجيل مستخدم جديد
router.post("/register", registerUser);

// تسجيل الدخول
router.post("/login", loginUser);

// جلب بيانات المستخدم الحالي (يتطلب توكن JWT)
router.get("/profile", protect, getProfile);

module.exports = router;
