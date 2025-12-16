const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, phone, password } = req.body || {};

    if (!username || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đăng ký" });
    }

    const existed = await User.findOne({
      $or: [{ username }, { phone }],
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc số điện thoại đã tồn tại",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      phone,
      password: hash,
      balance: 0,
      role: "user",
    });

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          role: user.role,
          balance: user.balance,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: e.message || "Lỗi server" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, phone, password } = req.body || {};

    if ((!username && !phone) || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin đăng nhập" });
    }

    const user = await User.findOne(username ? { username } : { phone });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "hacknohu-secret",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          role: user.role,
          balance: user.balance,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: e.message || "Lỗi server" });
  }
});

// GET /api/auth/profile
router.get("/profile", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user && req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user" });
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          role: user.role,
          balance: user.balance,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: e.message || "Lỗi server" });
  }
});

// POST /api/auth/play-game
router.post("/play-game", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user && req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy user" });
    }

    const cost = 5;

    if (user.balance < cost) {
      return res
        .status(400)
        .json({ success: false, message: "Không đủ xu" });
    }

    user.balance -= cost;
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
});

module.exports = router;


