const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();

// CORS configuration - cho phép cả local và production
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Danh sách các origin được phép
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Loại bỏ undefined/null
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Trong production, có thể cho phép tất cả hoặc chỉ định domain cụ thể
      // Để bảo mật hơn, uncomment dòng dưới và comment dòng callback(null, true)
      // callback(new Error('Not allowed by CORS'));
      callback(null, true); // Tạm thời cho phép tất cả để dễ deploy
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "hacknohu-backend-js" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 9999;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hacknohu";

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend:", err);
    process.exit(1);
  });


