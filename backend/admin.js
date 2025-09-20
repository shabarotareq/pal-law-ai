const express = require("express");
const Case = require("../models/Case");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ فقط المدير له صلاحيات
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "غير مصرح لك بالدخول" });
  }
};

// 🔹 جميع القضايا
router.get("/cases", protect, adminOnly, async (req, res) => {
  const cases = await Case.find().populate("user", "name email");
  res.json(cases);
});

// 🔹 إحصائيات القضايا حسب النوع
router.get("/cases/stats", protect, adminOnly, async (req, res) => {
  const stats = await Case.aggregate([
    { $group: { _id: "$lawType", count: { $sum: 1 } } },
  ]);
  res.json(stats);
});

// 🔹 جميع المستخدمين
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// 🔹 حذف مستخدم
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "تم حذف المستخدم" });
});

module.exports = router;
