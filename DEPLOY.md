# 🚀 Hướng Dẫn Deploy Web Hacknohu

## 📋 Tổng Quan

Dự án bao gồm:
- **Frontend**: React + Vite (port 3000 dev, build ra `dist/`)
- **Backend**: Node.js + Express (port 9999)
- **Database**: MongoDB (đã có connection string)

---

## 🎯 Phương Án 1: Deploy Lên Cloud (Khuyến Nghị)

### A. Frontend - Deploy lên Vercel (Miễn Phí)

#### Bước 1: Build Frontend
```bash
cd hacknohu
npm install
npm run build
```

#### Bước 2: Deploy lên Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click "Add New Project"
4. Import repository của bạn
5. Cấu hình:
   - **Framework Preset**: Vite
   - **Root Directory**: `hacknohu`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Thêm Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

7. Click "Deploy"

#### Bước 3: Cập nhật API URL
Sau khi deploy, cập nhật `VITE_API_BASE_URL` trong Vercel với URL backend của bạn.

---

### B. Backend - Deploy lên Railway (Miễn Phí $5/tháng)

#### Bước 1: Chuẩn bị
```bash
cd backend
```

#### Bước 2: Deploy lên Railway
1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Chọn repository và thư mục `backend`

5. Thêm Environment Variables:
   ```
   PORT=9999
   MONGO_URI=mongodb+srv://quanvhhe186714_db_user:ASyPeAj30tAuRT0d@nohuu.e4pezpb.mongodb.net/Nohuu?retryWrites=true&w=majority&appName=Nohuu
   JWT_SECRET=super_secret_change_me_please
   ```

6. Railway sẽ tự động deploy

7. Lấy URL backend (ví dụ: `https://your-app.railway.app`)

#### Bước 3: Seed Database
Sau khi deploy, chạy seed để tạo dữ liệu:
```bash
# Trong Railway, vào tab "Deployments" → "View Logs"
# Hoặc dùng Railway CLI:
railway run npm run seed
```

---

## 🎯 Phương Án 2: Deploy Lên VPS (Ubuntu/Debian)

### Bước 1: Chuẩn bị VPS
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js (v18 hoặc cao hơn)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2 (process manager)
sudo npm install -g pm2

# Cài đặt Nginx
sudo apt install -y nginx
```

### Bước 2: Deploy Backend

```bash
# Clone repository
git clone <your-repo-url>
cd hacnohu/backend

# Cài đặt dependencies
npm install

# Tạo file .env
nano .env
```

Thêm vào `.env`:
```
PORT=9999
MONGO_URI=mongodb+srv://quanvhhe186714_db_user:ASyPeAj30tAuRT0d@nohuu.e4pezpb.mongodb.net/Nohuu?retryWrites=true&w=majority&appName=Nohuu
JWT_SECRET=super_secret_change_me_please
```

```bash
# Seed database
npm run seed

# Chạy với PM2
pm2 start src/index.js --name "hacknohu-backend"
pm2 save
pm2 startup
```

### Bước 3: Deploy Frontend

```bash
cd ../hacknohu

# Cài đặt dependencies
npm install

# Build
npm run build

# Copy files vào Nginx
sudo cp -r dist/* /var/www/html/
```

### Bước 4: Cấu hình Nginx

```bash
sudo nano /etc/nginx/sites-available/hacknohu
```

Thêm cấu hình:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:9999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hacknohu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 5: Cài đặt SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🎯 Phương Án 3: Deploy Lên Render (Miễn Phí)

### A. Backend trên Render

1. Truy cập: https://render.com
2. Đăng nhập bằng GitHub
3. Click "New" → "Web Service"
4. Connect repository
5. Cấu hình:
   - **Name**: hacknohu-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

6. Thêm Environment Variables:
   ```
   PORT=9999
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=...
   ```

7. Click "Create Web Service"

### B. Frontend trên Render

1. Click "New" → "Static Site"
2. Connect repository
3. Cấu hình:
   - **Name**: hacknohu-frontend
   - **Build Command**: `cd hacknohu && npm install && npm run build`
   - **Publish Directory**: `hacknohu/dist`
   - **Root Directory**: `hacknohu`

4. Thêm Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

5. Click "Create Static Site"

---

## 🔧 Cấu Hình Quan Trọng

### 1. CORS Backend
Đảm bảo backend cho phép frontend domain:
```javascript
// backend/src/index.js
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
  credentials: true
}));
```

### 2. Environment Variables

**Frontend (.env hoặc Vercel/Render):**
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

**Backend (.env hoặc Railway/Render):**
```
PORT=9999
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key-here
```

### 3. Build Frontend
```bash
cd hacknohu
npm run build
# Output: hacknohu/dist/
```

---

## 📝 Checklist Trước Khi Deploy

- [ ] Backend đã chạy thành công local
- [ ] Frontend đã build thành công (`npm run build`)
- [ ] Database đã được seed (`npm run seed`)
- [ ] Environment variables đã được cấu hình
- [ ] CORS đã được cấu hình đúng
- [ ] API URL trong frontend đã được cập nhật

---

## 🐛 Troubleshooting

### Backend không kết nối được MongoDB
- Kiểm tra MongoDB connection string
- Kiểm tra IP whitelist trong MongoDB Atlas

### Frontend không gọi được API
- Kiểm tra CORS settings
- Kiểm tra `VITE_API_BASE_URL`
- Kiểm tra network tab trong browser console

### Build lỗi
- Xóa `node_modules` và `package-lock.json`
- Chạy lại `npm install`
- Kiểm tra Node.js version (>= 18)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Logs trong Vercel/Railway/Render dashboard
2. Browser console (F12)
3. Network tab để xem API calls

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công:
- Frontend: `https://your-frontend-domain.com`
- Backend: `https://your-backend-domain.com`
- API: `https://your-backend-domain.com/api`

Chúc bạn deploy thành công! 🚀

