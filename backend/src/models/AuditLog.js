const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String, // مثال: "CASE_CREATE", "CASE_DELETE_SOFT"
    entity: String, // مثال: "Case", "User"
    entityId: { type: String },
    meta: Object, // أي تفاصيل إضافية
    ip: String,
    ua: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
