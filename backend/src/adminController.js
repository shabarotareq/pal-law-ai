const User = require("../models/User");
const Case = require("../models/Case");

// جميع المستخدمين
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    res
      .status(500)
      .json({ message: "فشل في جلب المستخدمين", error: e.message });
  }
};

// تعديل دور مستخدم
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // user | lawyer | admin
    if (!["user", "lawyer", "admin"].includes(role)) {
      return res.status(400).json({ message: "دور غير صالح" });
    }
    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ message: "مستخدم غير موجود" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "فشل في تحديث الدور", error: e.message });
  }
};

// القضايا مع فلاتر: lawType, createdBy, from, to, q (بحث نصي)
const getAllCases = async (req, res) => {
  try {
    const { lawType, createdBy, from, to, q } = req.query;
    const filter = {};
    if (lawType) filter.lawType = lawType;
    if (createdBy) filter.createdBy = createdBy;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const cases = await Case.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (e) {
    res.status(500).json({ message: "فشل في جلب القضايا", error: e.message });
  }
};

// إحصائيات
const getStats = async (req, res) => {
  try {
    const byLawType = await Case.aggregate([
      { $group: { _id: "$lawType", count: { $sum: 1 } } },
      { $project: { _id: 0, lawType: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const byMonth = await Case.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, year: "$_id.y", month: "$_id.m", count: 1 } },
      { $sort: { year: 1, month: 1 } },
    ]);

    const totals = {
      users: await User.countDocuments(),
      cases: await Case.countDocuments(),
    };

    res.json({ byLawType, byMonth, totals });
  } catch (e) {
    res
      .status(500)
      .json({ message: "فشل في جلب الإحصائيات", error: e.message });
  }
};

module.exports = { getAllUsers, getAllCases, getStats, updateUserRole };
