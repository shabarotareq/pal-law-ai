const Case = require("../models/Case");
const { PERMISSIONS } = require("../middleware/rbac");
const { uploadFile } = require("../utils/storage");

// إنشاء قضية
const createCase = async (req, res) => {
  try {
    const { title, description, lawType, tags } = req.body;
    const attachments = [];
    if (req.files?.length) {
      for (const f of req.files) {
        attachments.push(await uploadFile(f));
      }
    }
    const newCase = await Case.create({
      title,
      description,
      lawType,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? String(tags)
            .split(",")
            .map((t) => t.trim())
        : [],
      createdBy: req.user._id,
      attachments,
    });
    res.status(201).json(newCase);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطأ في إنشاء القضية", error: error.message });
  }
};

// قائمة القضايا (خاصة بالمستخدم) مع فلاتر + التحكم بإظهار المحذوفة
const getCases = async (req, res) => {
  try {
    const { lawType, from, to, q, includeDeleted } = req.query;
    const filter = { createdBy: req.user._id };
    if (!includeDeleted) filter.deletedAt = null;
    if (lawType) filter.lawType = lawType;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$text = { $search: q };
    }
    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطأ في جلب القضايا", error: error.message });
  }
};

// تحديث قضية (المالك أو الأدمن)
const updateCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "قضية غير موجودة" });
    if (
      String(c.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "لا تملك صلاحية تعديل هذه القضية" });
    }

    const fields = ["title", "description", "lawType", "status", "tags"];
    fields.forEach((k) => {
      if (typeof req.body[k] !== "undefined") {
        if (k === "tags")
          c[k] = Array.isArray(req.body[k])
            ? req.body[k]
            : String(req.body[k])
                .split(",")
                .map((t) => t.trim());
        else c[k] = req.body[k];
      }
    });

    // مرفقات جديدة اختيارية
    if (req.files?.length) {
      for (const f of req.files) c.attachments.push(await uploadFile(f));
    }

    await c.save();
    res.json(c);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطأ في تحديث القضية", error: error.message });
  }
};

// Soft delete
const softDeleteCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "قضية غير موجودة" });
    if (
      String(c.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "لا تملك صلاحية حذف هذه القضية" });
    }
    c.deletedAt = new Date();
    await c.save();
    res.json({ message: "تم الحذف (Soft Delete)", case: c });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الحذف", error: error.message });
  }
};

// Restore
const restoreCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "قضية غير موجودة" });
    if (
      String(c.createdBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "لا تملك صلاحية الاستعادة" });
    }
    c.deletedAt = null;
    await c.save();
    res.json({ message: "تم الاستعادة", case: c });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الاستعادة", error: error.message });
  }
};

// Hard delete (أدمن فقط)
const hardDeleteCase = async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: "تم الحذف النهائي" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطأ في الحذف النهائي", error: error.message });
  }
};

module.exports = {
  createCase,
  getCases,
  updateCase,
  softDeleteCase,
  restoreCase,
  hardDeleteCase,
};
