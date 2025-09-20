// يسمح فقط للأدوار المحددة بالوصول
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "ممنوع: لا تملك صلاحية الوصول" });
    }
    next();
  };
};

module.exports = { authorize };
