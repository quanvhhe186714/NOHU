# Hướng Dẫn Thêm Hình Ảnh Game

## Vấn đề
Hình ảnh game từ hacknohu79.com không thể lấy trực tiếp vì:
- Yêu cầu authentication (đăng nhập)
- Hoặc đường dẫn khác với dự đoán

## Giải pháp

### Cách 1: Sử dụng script update-game-images.js

1. Mở file `backend/src/update-game-images.js`
2. Cập nhật object `gameImages` với URL hình ảnh thực tế:

```javascript
const gameImages = {
  "Dragon's Return": "https://your-image-url-here.jpg",
  "Fortune Ox": "https://your-image-url-here.jpg",
  // ... thêm các game khác
};
```

3. Chạy script:
```bash
cd backend
npm run update-images
```

### Cách 2: Cập nhật trực tiếp trong seed.js

1. Mở file `backend/src/seed.js`
2. Tìm game cần cập nhật
3. Thay đổi `image_url` thành URL hình ảnh thực tế
4. Chạy lại seed:
```bash
cd backend
npm run seed
```

### Cách 3: Lấy hình ảnh từ hacknohu79.com (sau khi đăng nhập)

1. Đăng nhập vào https://hacknohu79.com
2. Mở Developer Tools (F12)
3. Vào tab Network
4. Vào Dashboard và xem các game
5. Tìm các request hình ảnh game trong Network tab
6. Copy URL hình ảnh thực tế
7. Cập nhật vào `update-game-images.js` hoặc `seed.js`

### Cách 4: Upload hình ảnh lên server của bạn

1. Upload hình ảnh game lên server/CDN của bạn
2. Lấy URL hình ảnh
3. Cập nhật vào database

## Lưu ý

- Hiện tại đang dùng placeholder images từ Unsplash
- Tất cả games đã có placeholder images
- Bạn có thể thay thế bất cứ lúc nào bằng cách cập nhật URL trong database

## Scripts có sẵn

- `npm run seed` - Tạo lại tất cả dữ liệu (lobbies + games)
- `npm run update-images` - Chỉ cập nhật hình ảnh game (giữ nguyên dữ liệu khác)
- `npm run create-admin` - Tạo tài khoản admin

