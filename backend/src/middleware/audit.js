const AuditLog = require("../models/AuditLog");

const audit = (
  action,
  entity,
  getEntityId = (req, res) => null,
  getMeta = (req, res) => ({})
) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      try {
        // لا نسجّل إلا العمليات الناجحة (2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          await AuditLog.create({
            user: req.user?._id,
            action,
            entity,
            entityId: String(getEntityId(req, res) || ""),
            meta: getMeta(req, res),
            ip: req.ip,
            ua: req.headers["user-agent"],
          });
        }
      } catch (e) {
        // نتجاهل أخطاء اللوج حتى لا تعطل المسار
        console.error("Audit error:", e.message);
      }
    });
    next();
  };
};

module.exports = { audit };
