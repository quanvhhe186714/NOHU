# ⚡ Render Backend - Quick Start Guide

## 🎯 Cấu Hình Nhanh (5 Phút)

### Trên Render Dashboard:

1. **New Web Service** → Connect GitHub → Chọn `quanvhhe186714/NOHU`

2. **Cấu hình cơ bản:**
   ```
   Name: hacknohu-backend
   Language: Node
   Branch: main
   Region: Singapore (hoặc Oregon)
   Root Directory: backend
   ```

3. **Build & Start Commands:**
   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

4. **Environment Variables:**
   ```
   PORT = 9999
   MONGO_URI = mongodb+srv://quanvhhe186714_db_user:ASyPeAj30tAuRT0d@nohuu.e4pezpb.mongodb.net/Nohuu?retryWrites=true&w=majority&appName=Nohuu
   JWT_SECRET = super_secret_change_me_please
   NODE_ENV = production
   ```

5. **Click "Create Web Service"** → Chờ deploy (3-5 phút)

6. **Sau khi deploy xong:**
   - Vào tab "Shell"
   - Chạy: `cd backend && npm run seed`
   - Chạy: `cd backend && npm run create-admin`

### ✅ Xong! Backend URL: `https://hacknohu-backend.onrender.com`

---

## 📝 Chi Tiết Đầy Đủ

Xem file **`RENDER_BACKEND_DEPLOY.md`** để biết hướng dẫn chi tiết.

---

## 🔗 Links Hữu Ích

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

