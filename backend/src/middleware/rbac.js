// تعريف عمليات/تصاريح عالية المستوى
const PERMISSIONS = {
  CASE_CREATE: "case:create",
  CASE_READ: "case:read",
  CASE_UPDATE: "case:update",
  CASE_DELETE_SOFT: "case:delete:soft",
  CASE_RESTORE: "case:restore",
  CASE_DELETE_HARD: "case:delete:hard",
  USER_ROLE_UPDATE: "user:role:update",
  AUDIT_READ: "audit:read",
  FILE_UPLOAD: "file:upload",
};

// تعيين التصاريح لكل دور
const ROLE_PERMS = {
  user: [
    PERMISSIONS.CASE_CREATE,
    PERMISSIONS.CASE_READ,
    PERMISSIONS.CASE_UPDATE,
    PERMISSIONS.CASE_DELETE_SOFT,
    PERMISSIONS.CASE_RESTORE,
    PERMISSIONS.FILE_UPLOAD,
  ],
  lawyer: [
    PERMISSIONS.CASE_CREATE,
    PERMISSIONS.CASE_READ,
    PERMISSIONS.CASE_UPDATE,
    PERMISSIONS.CASE_DELETE_SOFT,
    PERMISSIONS.CASE_RESTORE,
    PERMISSIONS.FILE_UPLOAD,
  ],
  admin: [
    PERMISSIONS.CASE_CREATE,
    PERMISSIONS.CASE_READ,
    PERMISSIONS.CASE_UPDATE,
    PERMISSIONS.CASE_DELETE_SOFT,
    PERMISSIONS.CASE_RESTORE,
    PERMISSIONS.CASE_DELETE_HARD,
    PERMISSIONS.USER_ROLE_UPDATE,
    PERMISSIONS.AUDIT_READ,
    PERMISSIONS.FILE_UPLOAD,
  ],
};

const can = (...requiredPerms) => {
  return (req, res, next) => {
    const role = req.user?.role || "user";
    const perms = ROLE_PERMS[role] || [];
    const ok = requiredPerms.every((p) => perms.includes(p));
    if (!ok)
      return res.status(403).json({ message: "غير مسموح: صلاحيات غير كافية" });
    next();
  };
};

module.exports = { PERMISSIONS, can };
