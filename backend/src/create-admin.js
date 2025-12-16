const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { User } = require("./models/User");

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hacknohu";

async function createAdmin() {
  try {
    await connectDB(MONGO_URI);
    console.log("Connected to MongoDB");

    // Admin credentials - bạn có thể thay đổi
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPhone = process.env.ADMIN_PHONE || "0123456789";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminRole = "admin";

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { username: adminUsername },
        { phone: adminPhone },
        { role: "admin" },
      ],
    });

    if (existingAdmin) {
      console.log("⚠️  Admin account already exists!");
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Phone: ${existingAdmin.phone}`);
      console.log(`Role: ${existingAdmin.role}`);
      
      // Update password if needed
      if (process.env.ADMIN_PASSWORD) {
        existingAdmin.password = await bcrypt.hash(adminPassword, 10);
        await existingAdmin.save();
        console.log("✅ Admin password updated!");
      }
      
      process.exit(0);
      return;
    }

    // Create admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      username: adminUsername,
      phone: adminPhone,
      password: hashedPassword,
      balance: 1000000, // 1 triệu xu cho admin
      role: adminRole,
    });

    console.log("✅ Admin account created successfully!");
    console.log("=".repeat(50));
    console.log("Admin Credentials:");
    console.log(`Username: ${adminUsername}`);
    console.log(`Phone: ${adminPhone}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: ${adminRole}`);
    console.log(`Balance: 1,000,000 xu`);
    console.log("=".repeat(50));
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  }
}

createAdmin();

