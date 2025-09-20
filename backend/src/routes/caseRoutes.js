const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { can, PERMISSIONS } = require("../middleware/rbac");
const { audit } = require("../middleware/audit");
const upload = require("../middleware/upload");

const {
  createCase,
  getCases,
  updateCase,
  softDeleteCase,
  restoreCase,
  hardDeleteCase,
} = require("../controllers/caseController");

const router = express.Router();

router.use(protect);

// إنشاء قضية + رفع مرفقات
router.post(
  "/",
  can(PERMISSIONS.CASE_CREATE, PERMISSIONS.FILE_UPLOAD),
  upload.array("files", 10),
  audit(
    "CASE_CREATE",
    "Case",
    (req, res) => null,
    (req) => ({ title: req.body.title })
  ),
  createCase
);

// قضاياي (فلاتر + includeDeleted)
router.get("/", can(PERMISSIONS.CASE_READ), getCases);

// تعديل قضية + مرفقات
router.put(
  "/:id",
  can(PERMISSIONS.CASE_UPDATE),
  upload.array("files", 10),
  audit("CASE_UPDATE", "Case", (req) => req.params.id),
  updateCase
);

// Soft delete / Restore
router.patch(
  "/:id/soft-delete",
  can(PERMISSIONS.CASE_DELETE_SOFT),
  audit("CASE_DELETE_SOFT", "Case", (req) => req.params.id),
  softDeleteCase
);

router.patch(
  "/:id/restore",
  can(PERMISSIONS.CASE_RESTORE),
  audit("CASE_RESTORE", "Case", (req) => req.params.id),
  restoreCase
);

// Hard delete (أدمن فقط)
router.delete(
  "/:id",
  can(PERMISSIONS.CASE_DELETE_HARD),
  audit("CASE_DELETE_HARD", "Case", (req) => req.params.id),
  hardDeleteCase
);

module.exports = router;
