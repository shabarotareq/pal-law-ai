const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { can, PERMISSIONS } = require("../middleware/rbac");
const {
  getAllUsers,
  getAllCases,
  getStats,
  updateUserRole,
} = require("../controllers/adminController");
const AuditLog = require("../models/AuditLog");

const router = express.Router();
router.use(protect, authorize("admin"));

// المستخدمون + تعديل الدور
router.get("/users", getAllUsers);
router.put(
  "/users/:id/role",
  can(PERMISSIONS.USER_ROLE_UPDATE),
  updateUserRole
);

// القضايا (مع فلاتر)
router.get("/cases", getAllCases);

// إحصائيات
router.get("/stats", getStats);

// سجلات التدقيق
router.get("/audits", can(PERMISSIONS.AUDIT_READ), async (req, res) => {
  try {
    const { action, user, from, to } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (user) filter.user = user;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const logs = await AuditLog.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(logs);
  } catch (e) {
    res.status(500).json({ message: "فشل في جلب السجلات", error: e.message });
  }
});

module.exports = router;
