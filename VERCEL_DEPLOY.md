# 🚀 Hướng Dẫn Deploy Frontend Lên Vercel

## 📋 Cấu Hình Chi Tiết Cho Dự Án Hacknohu

### Bước 1: Truy Cập Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub account
3. Click "Add New Project" hoặc "Import Project"

### Bước 2: Import Repository
1. Chọn repository: `quanvhhe186714/NOHU`
2. Click "Import"

### Bước 3: Cấu Hình Project Settings

#### Framework Preset
- **Chọn**: `Other` hoặc `Vite`
- (Vercel sẽ tự động detect Vite nếu có `vite.config.ts`)

#### Root Directory
- **Giá trị**: `hacknohu`
- Click "Edit" và nhập: `hacknohu`
- **Lý do**: Code frontend nằm trong thư mục `hacknohu/`

#### Build and Output Settings

**Build Command:**
```
npm run build
```
- Click vào icon bút chì (pencil icon) để edit
- Xóa text mặc định
- Nhập: `npm run build`

**Output Directory:**
```
dist
```
- Click vào icon bút chì (pencil icon) để edit
- Xóa text mặc định
- Nhập: `dist`
- **Lý do**: Vite build output vào thư mục `dist/`

**Install Command:**
```
npm install
```
- Click vào icon bút chì (pencil icon) để edit
- Xóa text mặc định
- Nhập: `npm install`
- Hoặc để mặc định (Vercel sẽ tự động dùng npm)

### Bước 4: Environment Variables

Click vào section "Environment Variables" để mở rộng, sau đó thêm:

#### Production Environment:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-url.com/api`
  - Thay `your-backend-url.com` bằng URL backend thực tế của bạn
  - Ví dụ: `https://hacknohu-backend.railway.app/api`
  - Hoặc: `https://hacknohu-backend.onrender.com/api`

#### Preview Environment (Optional):
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-url.com/api` (giống Production)

#### Development Environment (Optional):
- **Key**: `VITE_API_BASE_URL`
- **Value**: `http://localhost:9999/api`

**Cách thêm:**
1. Click "Add" hoặc "+"
2. Nhập Key: `VITE_API_BASE_URL`
3. Nhập Value: URL backend của bạn
4. Chọn environment (Production, Preview, Development)
5. Click "Save"

### Bước 5: Deploy

1. Kiểm tra lại tất cả cấu hình:
   - ✅ Framework Preset: Other hoặc Vite
   - ✅ Root Directory: `hacknohu`
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `dist`
   - ✅ Install Command: `npm install`
   - ✅ Environment Variables: `VITE_API_BASE_URL` đã được thêm

2. Click nút **"Deploy"** (màu xám đậm ở cuối form)

3. Chờ quá trình deploy hoàn tất (thường mất 1-3 phút)

4. Sau khi deploy xong, Vercel sẽ cung cấp URL:
   - Production: `https://your-project-name.vercel.app`
   - Bạn có thể thêm custom domain sau

---

## 📝 Tóm Tắt Cấu Hình

```
Framework Preset: Other (hoặc Vite)
Root Directory: hacknohu
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables:
  VITE_API_BASE_URL = https://your-backend-url.com/api
```

---

## 🔧 Sau Khi Deploy

### 1. Kiểm Tra Build Logs
- Vào tab "Deployments"
- Click vào deployment mới nhất
- Xem "Build Logs" để kiểm tra lỗi (nếu có)

### 2. Test Website
- Truy cập URL được cung cấp
- Kiểm tra xem frontend có load được không
- Mở Developer Tools (F12) → Console để xem lỗi

### 3. Cập Nhật Backend URL
Nếu backend URL thay đổi:
1. Vào Project Settings
2. Vào "Environment Variables"
3. Cập nhật `VITE_API_BASE_URL`
4. Redeploy (hoặc tự động redeploy)

---

## ⚠️ Lưu Ý Quan Trọng

1. **Root Directory phải là `hacknohu`**
   - Không phải `.` hoặc `./`
   - Phải là `hacknohu` (tên thư mục chứa frontend)

2. **Output Directory phải là `dist`**
   - Vite build ra thư mục `dist/`
   - Không phải `build/` hay `public/`

3. **Environment Variables**
   - Phải thêm `VITE_API_BASE_URL` trước khi deploy
   - Nếu không có, frontend sẽ không gọi được API

4. **Backend phải đã được deploy trước**
   - Frontend cần backend URL để hoạt động
   - Đảm bảo backend đã chạy và có CORS cho phép domain Vercel

---

## 🐛 Troubleshooting

### Build Failed
- Kiểm tra "Build Logs" trong Vercel
- Đảm bảo Root Directory đúng: `hacknohu`
- Đảm bảo `package.json` có script `build`

### Frontend không gọi được API
- Kiểm tra `VITE_API_BASE_URL` đã được set chưa
- Kiểm tra backend có cho phép CORS từ domain Vercel không
- Kiểm tra Network tab trong browser console

### 404 khi truy cập routes
- Vercel cần file `vercel.json` để handle SPA routing
- Hoặc cấu hình "Rewrites" trong Vercel settings

---

## 📄 File vercel.json (Optional - Nếu cần)

Tạo file `hacknohu/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

File này giúp Vercel handle routing cho React SPA.

---

## ✅ Checklist Trước Khi Deploy

- [ ] Đã có GitHub repository với code
- [ ] Backend đã được deploy và có URL
- [ ] Đã biết backend URL để điền vào `VITE_API_BASE_URL`
- [ ] Đã test build local: `cd hacknohu && npm run build`
- [ ] Build thành công và tạo thư mục `dist/`

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công:
- Frontend URL: `https://your-project.vercel.app`
- Backend URL: `https://your-backend-url.com`
- Website đã sẵn sàng sử dụng!

Chúc bạn deploy thành công! 🚀

