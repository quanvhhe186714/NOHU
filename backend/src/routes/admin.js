const express = require("express");
const bcrypt = require("bcryptjs");
const { auth } = require("../middleware/auth");
const { User } = require("../models/User");

const router = express.Router();

// GET /api/admin/users?search=&page=1&limit=8
router.get("/users", auth(["admin", "moderator"]), async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page || "1", 10) || 1;
    const limit = parseInt(req.query.limit || "8", 10) || 8;

    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform _id to id for frontend compatibility
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      phone: user.phone,
      balance: user.balance,
      role: user.role,
      createdAt: user.createdAt,
    }));

    return res.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: e.message || "Lỗi server" });
  }
});

// POST /api/admin/users/:id/balance
router.post(
  "/users/:id/balance",
  auth(["admin", "moderator"]),
  async (req, res) => {
    try {
      const rawAmount = req.body && req.body.amount;
      const amount =
        typeof rawAmount === "string"
          ? parseInt(rawAmount, 10)
          : Number(rawAmount);

      if (Number.isNaN(amount)) {
        return res
          .status(400)
          .json({ success: false, message: "Số xu không hợp lệ" });
      }

      if (Math.abs(amount) > 1_000_000) {
        return res.status(400).json({
          success: false,
          message: "Số xu vượt quá 1,000,000",
        });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy user" });
      }

      user.balance += amount;
      await user.save();

      return res.json({
        success: true,
        data: { balance: user.balance },
      });
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: e.message || "Lỗi server" });
    }
  }
);

// POST /api/admin/users/:id/password
router.post(
  "/users/:id/password",
  auth(["admin", "moderator"]),
  async (req, res) => {
    try {
      const newPassword = req.body && req.body.newPassword;

      if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu phải có ít nhất 4 ký tự",
        });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy user" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return res.json({ success: true });
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: e.message || "Lỗi server" });
    }
  }
);

module.exports = router;


