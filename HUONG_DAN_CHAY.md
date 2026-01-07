#  Hướng Dẫn Chạy Nhanh

## Bước 1: Cài đặt Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd src
npm install
cd ..
```

## Bước 2: Chạy Backend (Terminal 1)

```bash
cd src
npm start
```

Hoặc với auto-reload (khuyến nghị):
```bash
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

Bạn sẽ thấy thông báo: `Server đang chạy tại http://localhost:5000`

## Bước 3: Chạy Frontend (Terminal 2)

Mở terminal mới (giữ terminal backend đang chạy):

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

##  Kiểm tra

1. Mở trình duyệt và truy cập: `http://localhost:5173`
2. Bạn sẽ thấy giao diện **TODO LIST PRO** với:
   - Form thêm công việc ở trên cùng
   - Các nút lọc theo trạng thái, ưu tiên, danh mục
   - Danh sách công việc ở dưới
3. **Thử thêm một công việc mới**:
   - Nhập tên công việc
   - Nhấn nút **+** để mở form chi tiết
   - Thử chọn ngày bằng **Date Picker** (lịch dạng bảng)
   - Nhấn **+ Thêm** để thêm công việc

##  Lưu ý

-  **Phải chạy backend trước** khi mở frontend
- Dữ liệu sẽ được lưu tự động vào `src/data/todos.json`
- Nếu gặp lỗi kết nối, kiểm tra xem backend đã chạy chưa
- Giao diện sử dụng Tailwind CSS với gradient và animations đẹp mắt
- Date Picker tự xây dựng với lịch dạng bảng, không cần thư viện bên ngoài

##  Troubleshooting

### Lỗi: "Cannot connect to backend"
-  Đảm bảo backend đang chạy tại port 5000
-  Kiểm tra terminal backend có hiển thị "Server đang chạy tại http://localhost:5000"
-  Mở trình duyệt và truy cập `http://localhost:5000/api/todos` để kiểm tra backend

### Lỗi: "Module not found"
-  Chạy lại `npm install` trong cả thư mục gốc và `src/`
-  Xóa `node_modules` và `package-lock.json` rồi cài lại nếu cần

### Port đã được sử dụng
- Thay đổi `CONG` (PORT) trong `src/server.js` nếu port 5000 đã bị chiếm
- Hoặc tắt ứng dụng đang dùng port đó

### Date Picker không hiển thị
-  Kiểm tra console có lỗi không
-  Đảm bảo component `ChonNgay.jsx` đã được import đúng
-  Refresh lại trang (F5)

### Dữ liệu không lưu
-  Kiểm tra thư mục `src/data/` đã được tạo chưa
-  Kiểm tra quyền ghi file trong thư mục `src/data/`
-  Xem console backend có lỗi gì không

##  Mẹo sử dụng

-  **Thêm nhanh**: Chỉ cần nhập tên và Enter, không cần mở form chi tiết
-  **Chọn ngày nhanh**: Dùng nút "Hôm nay" hoặc "Ngày mai" trong Date Picker
-  **Tìm kiếm**: Gõ từ khóa để lọc ngay lập tức
-  **Xem thống kê**: Nhấn nút "Hiện Thống Kê" để xem tổng quan
-  **Lọc nhanh**: Kết hợp nhiều bộ lọc để tìm chính xác công việc cần

