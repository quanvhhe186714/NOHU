# 🚀 Hướng Dẫn Deploy Backend Lên Render

## 📋 Cấu Hình Chi Tiết Cho Backend Hacknohu

### Bước 1: Truy Cập Render Dashboard
1. Truy cập: https://dashboard.render.com
2. Đăng nhập bằng GitHub account
3. Click "New +" → "Web Service"

### Bước 2: Connect Repository

#### Source Code Section:
1. Click "Edit" button bên cạnh Source Code
2. Chọn "Connect GitHub" (nếu chưa connect)
3. Chọn repository: `quanvhhe186714/NOHU`
4. Click "Connect"

### Bước 3: Cấu Hình Web Service

#### Name:
- **Giá trị**: `hacknohu-backend` (hoặc tên bạn muốn)
- **Mô tả**: Tên unique cho web service của bạn
- **Lưu ý**: Tên này sẽ là phần của URL (ví dụ: `hacknohu-backend.onrender.com`)

#### Project (Optional):
- **Select a project**: Có thể để trống hoặc chọn project có sẵn
- **Select an environment**: Có thể để trống

#### Language:
- **Chọn**: `Node`
- Render sẽ tự động detect Node.js từ `package.json`

#### Branch:
- **Chọn**: `main`
- Đây là branch chứa code backend

#### Region:
- **Chọn**: `Singapore (Southeast Asia)` (gần Việt Nam) hoặc `Oregon (US West)`
- **Lưu ý**: Chọn region gần nhất với người dùng của bạn

### Bước 4: Cấu Hình Build & Deploy

Sau khi click "Create Web Service", bạn sẽ thấy các settings sau:

#### Build Command:
```
cd backend && npm install
```
Hoặc đơn giản hơn:
```
npm install
```
(Nếu Root Directory đã được set là `backend`)

#### Start Command:
```
cd backend && npm start
```
Hoặc:
```
npm start
```
(Nếu Root Directory đã được set là `backend`)

#### Root Directory (Quan trọng!):
- **Giá trị**: `backend`
- Click "Edit" và nhập: `backend`
- **Lý do**: Code backend nằm trong thư mục `backend/`

### Bước 5: Environment Variables

Click vào tab "Environment" và thêm các biến sau:

#### 1. PORT:
- **Key**: `PORT`
- **Value**: `9999`
- **Lưu ý**: Render sẽ tự động set PORT, nhưng bạn có thể set cụ thể

#### 2. MONGO_URI:
- **Key**: `MONGO_URI`
- **Value**: `mongodb+srv://quanvhhe186714_db_user:ASyPeAj30tAuRT0d@nohuu.e4pezpb.mongodb.net/Nohuu?retryWrites=true&w=majority&appName=Nohuu`
- **Lưu ý**: Đây là connection string MongoDB của bạn

#### 3. JWT_SECRET:
- **Key**: `JWT_SECRET`
- **Value**: `super_secret_change_me_please` (nên đổi thành secret mạnh hơn)
- **Lưu ý**: Nên dùng chuỗi ngẫu nhiên mạnh cho production

#### 4. NODE_ENV (Optional):
- **Key**: `NODE_ENV`
- **Value**: `production`

**Cách thêm Environment Variables:**
1. Click "Add Environment Variable"
2. Nhập Key và Value
3. Click "Save Changes"

### Bước 6: Advanced Settings (Optional)

#### Auto-Deploy:
- **Enabled**: Bật tự động deploy khi có commit mới
- **Branch**: `main`

#### Health Check Path:
- **Path**: `/`
- Render sẽ check endpoint này để đảm bảo service đang chạy

#### Health Check Interval:
- **Giá trị mặc định**: 10 seconds

### Bước 7: Deploy

1. Kiểm tra lại tất cả cấu hình:
   - ✅ Name: `hacknohu-backend`
   - ✅ Language: `Node`
   - ✅ Branch: `main`
   - ✅ Root Directory: `backend`
   - ✅ Build Command: `cd backend && npm install` hoặc `npm install`
   - ✅ Start Command: `cd backend && npm start` hoặc `npm start`
   - ✅ Environment Variables: `PORT`, `MONGO_URI`, `JWT_SECRET` đã được thêm

2. Click "Create Web Service"

3. Render sẽ bắt đầu build và deploy (thường mất 3-5 phút)

4. Sau khi deploy xong, bạn sẽ có URL:
   - **URL**: `https://hacknohu-backend.onrender.com`
   - **API Base URL**: `https://hacknohu-backend.onrender.com/api`

### Bước 8: Seed Database

Sau khi deploy thành công, cần seed database:

#### Cách 1: Dùng Render Shell
1. Vào service dashboard
2. Click tab "Shell"
3. Chạy lệnh:
```bash
cd backend
npm run seed
```

#### Cách 2: Dùng Render CLI
```bash
# Cài đặt Render CLI
npm install -g render-cli

# Login
render login

# Chạy seed
render run --service hacknohu-backend -- npm run seed
```

#### Cách 3: Tạo Admin User
```bash
# Trong Render Shell
cd backend
npm run create-admin
```

---

## 📝 Tóm Tắt Cấu Hình

```
Name: hacknohu-backend
Language: Node
Branch: main
Root Directory: backend
Build Command: cd backend && npm install
Start Command: cd backend && npm start

Environment Variables:
  PORT = 9999
  MONGO_URI = mongodb+srv://...
  JWT_SECRET = super_secret_change_me_please
  NODE_ENV = production
```

---

## 🔧 Sau Khi Deploy

### 1. Kiểm Tra Logs
- Vào service dashboard
- Click tab "Logs"
- Xem build logs và runtime logs
- Kiểm tra lỗi (nếu có)

### 2. Test API
- Truy cập: `https://hacknohu-backend.onrender.com`
- Kết quả mong đợi: `{"ok":true,"service":"hacknohu-backend-js"}`

- Test API endpoint:
  - `https://hacknohu-backend.onrender.com/api/dashboard`
  - (Cần authentication token)

### 3. Cập Nhật Frontend
Sau khi có backend URL, cập nhật frontend:
- Vào Vercel (hoặc hosting frontend)
- Cập nhật Environment Variable:
  - `VITE_API_BASE_URL = https://hacknohu-backend.onrender.com/api`

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Root Directory
- **Phải là**: `backend`
- Không phải `.` hay `./`
- Render cần biết code backend ở đâu

### 2. Build Command
- Nếu Root Directory là `backend`, có thể dùng: `npm install`
- Nếu Root Directory là `.`, phải dùng: `cd backend && npm install`

### 3. Start Command
- Tương tự Build Command
- Phải chạy được `npm start` trong thư mục `backend`

### 4. Environment Variables
- **MONGO_URI**: Phải đúng format MongoDB connection string
- **JWT_SECRET**: Nên đổi thành secret mạnh hơn cho production
- **PORT**: Render tự động set, nhưng bạn có thể override

### 5. Free Tier Limitations
- Render free tier có thể "sleep" sau 15 phút không có traffic
- Lần đầu truy cập sau khi sleep sẽ mất 30-60 giây để wake up
- Để tránh sleep, có thể dùng service như UptimeRobot để ping định kỳ

---

## 🐛 Troubleshooting

### Build Failed
**Lỗi**: Build command failed
**Giải pháp**:
- Kiểm tra Root Directory đúng chưa
- Kiểm tra `package.json` có trong thư mục `backend/` không
- Xem build logs để biết lỗi cụ thể

### Service Crashed
**Lỗi**: Service crashed on startup
**Giải pháp**:
- Kiểm tra Start Command đúng chưa
- Kiểm tra Environment Variables đã được set chưa
- Kiểm tra MongoDB connection string đúng chưa
- Xem runtime logs để biết lỗi cụ thể

### Cannot Connect to MongoDB
**Lỗi**: MongoDB connection failed
**Giải pháp**:
- Kiểm tra MONGO_URI đúng format chưa
- Kiểm tra MongoDB Atlas IP whitelist (cho phép 0.0.0.0/0 để test)
- Kiểm tra username/password đúng chưa

### API Returns 404
**Lỗi**: API endpoint not found
**Giải pháp**:
- Kiểm tra routes trong `backend/src/index.js`
- Đảm bảo API path bắt đầu với `/api`
- Kiểm tra CORS settings

---

## 🔒 Bảo Mật

### 1. JWT Secret
- Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên mạnh
- Có thể dùng: `openssl rand -base64 32`

### 2. MongoDB
- Không commit connection string vào code
- Dùng Environment Variables
- Giới hạn IP whitelist trong MongoDB Atlas

### 3. CORS
- Cấu hình CORS chỉ cho phép domain frontend của bạn
- Không dùng `*` trong production

---

## 📊 Monitoring

### Render Dashboard
- Xem metrics: CPU, Memory, Network
- Xem logs: Build logs, Runtime logs
- Xem events: Deployments, Restarts

### Health Checks
- Render tự động check health
- Nếu service down, Render sẽ tự động restart

---

## ✅ Checklist Trước Khi Deploy

- [ ] Code đã được push lên GitHub
- [ ] Repository đã được connect với Render
- [ ] Root Directory đã được set: `backend`
- [ ] Build Command đã được cấu hình
- [ ] Start Command đã được cấu hình
- [ ] Environment Variables đã được thêm:
  - [ ] PORT
  - [ ] MONGO_URI
  - [ ] JWT_SECRET
- [ ] MongoDB Atlas đã cho phép IP từ Render
- [ ] Đã test build local: `cd backend && npm install && npm start`

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công:
- **Backend URL**: `https://hacknohu-backend.onrender.com`
- **API Base URL**: `https://hacknohu-backend.onrender.com/api`
- **Health Check**: `https://hacknohu-backend.onrender.com/`

**Tiếp theo:**
1. Seed database: `npm run seed`
2. Tạo admin user: `npm run create-admin`
3. Cập nhật frontend với backend URL
4. Test toàn bộ hệ thống

Chúc bạn deploy thành công! 🚀

