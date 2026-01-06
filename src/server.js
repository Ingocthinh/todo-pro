const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const ungDung = express();
const CONG = 5000;
const FILE_DU_LIEU = path.join(__dirname, 'data', 'todos.json');

// Middleware
// CORS configuration - cho phép cả localhost và production URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Thêm từ environment variable
].filter(Boolean); // Loại bỏ giá trị undefined/null

ungDung.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
ungDung.use(express.json());

// Đảm bảo thư mục data tồn tại
const damBaoThuMucDuLieu = async () => {
  const thuMucDuLieu = path.dirname(FILE_DU_LIEU);
  try {
    await fs.access(thuMucDuLieu);
  } catch {
    await fs.mkdir(thuMucDuLieu, { recursive: true });
  }
};

// Đọc dữ liệu từ file
const docDanhSachCongViec = async () => {
  try {
    await damBaoThuMucDuLieu();
    const duLieu = await fs.readFile(FILE_DU_LIEU, 'utf8');
    return JSON.parse(duLieu);
  } catch (loi) {
    if (loi.code === 'ENOENT') {
      return [];
    }
    console.error('Lỗi đọc file:', loi);
    return [];
  }
};

// Ghi dữ liệu vào file
const ghiDanhSachCongViec = async (danhSachCongViec) => {
  try {
    await damBaoThuMucDuLieu();
    await fs.writeFile(FILE_DU_LIEU, JSON.stringify(danhSachCongViec, null, 2), 'utf8');
  } catch (loi) {
    console.error('Lỗi ghi file:', loi);
    throw loi;
  }
};

// Các route API

// 1. Lấy danh sách tất cả công việc
ungDung.get('/api/todos', async (yeuCau, phanHoi) => {
  try {
    const danhSachCongViec = await docDanhSachCongViec();
    phanHoi.json(danhSachCongViec);
  } catch (loi) {
    phanHoi.status(500).json({ message: 'Lỗi server', loi: loi.message });
  }
});

// 2. Thêm công việc mới
ungDung.post('/api/todos', async (yeuCau, phanHoi) => {
  try {
    const { text, priority = 'medium', dueDate, category = 'general' } = yeuCau.body;
    
    if (!text || !text.trim()) {
      return phanHoi.status(400).json({ message: 'Nội dung không được để trống' });
    }
    
    const danhSachCongViec = await docDanhSachCongViec();
    const congViecMoi = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    danhSachCongViec.push(congViecMoi);
    await ghiDanhSachCongViec(danhSachCongViec);
    phanHoi.status(201).json(congViecMoi);
  } catch (loi) {
    phanHoi.status(500).json({ message: 'Lỗi server', loi: loi.message });
  }
});

// 3. Cập nhật công việc (toàn bộ hoặc một phần)
ungDung.put('/api/todos/:id', async (yeuCau, phanHoi) => {
  try {
    const { id } = yeuCau.params;
    const capNhat = yeuCau.body;
    
    const danhSachCongViec = await docDanhSachCongViec();
    const chiSoCongViec = danhSachCongViec.findIndex(congViec => congViec.id == id);
    
    if (chiSoCongViec === -1) {
      return phanHoi.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    // Cập nhật các trường được gửi lên
    danhSachCongViec[chiSoCongViec] = {
      ...danhSachCongViec[chiSoCongViec],
      ...capNhat,
      id: danhSachCongViec[chiSoCongViec].id, // Giữ nguyên ID
      updatedAt: new Date().toISOString()
    };
    
    await ghiDanhSachCongViec(danhSachCongViec);
    phanHoi.json(danhSachCongViec[chiSoCongViec]);
  } catch (loi) {
    phanHoi.status(500).json({ message: 'Lỗi server', loi: loi.message });
  }
});

// 4. Xóa công việc
ungDung.delete('/api/todos/:id', async (yeuCau, phanHoi) => {
  try {
    const { id } = yeuCau.params;
    const danhSachCongViec = await docDanhSachCongViec();
    const danhSachDaLoc = danhSachCongViec.filter(congViec => congViec.id != id);
    
    if (danhSachDaLoc.length === danhSachCongViec.length) {
      return phanHoi.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    
    await ghiDanhSachCongViec(danhSachDaLoc);
    phanHoi.json({ message: 'Đã xóa thành công' });
  } catch (loi) {
    phanHoi.status(500).json({ message: 'Lỗi server', loi: loi.message });
  }
});

// 5. Lấy thống kê
ungDung.get('/api/stats', async (yeuCau, phanHoi) => {
  try {
    const danhSachCongViec = await docDanhSachCongViec();
    const tongSo = danhSachCongViec.length;
    const daHoanThanh = danhSachCongViec.filter(congViec => congViec.completed).length;
    const chuaXong = tongSo - daHoanThanh;
    const theoUuTien = {
      high: danhSachCongViec.filter(congViec => congViec.priority === 'high').length,
      medium: danhSachCongViec.filter(congViec => congViec.priority === 'medium').length,
      low: danhSachCongViec.filter(congViec => congViec.priority === 'low').length
    };
    const theoDanhMuc = {};
    danhSachCongViec.forEach(congViec => {
      theoDanhMuc[congViec.category] = (theoDanhMuc[congViec.category] || 0) + 1;
    });
    
    const quaHan = danhSachCongViec.filter(congViec => {
      if (!congViec.dueDate || congViec.completed) return false;
      return new Date(congViec.dueDate) < new Date();
    }).length;
    
    phanHoi.json({
      total: tongSo,
      completed: daHoanThanh,
      pending: chuaXong,
      byPriority: theoUuTien,
      byCategory: theoDanhMuc,
      overdue: quaHan
    });
  } catch (loi) {
    phanHoi.status(500).json({ message: 'Lỗi server', loi: loi.message });
  }
});

// 6. Xóa tất cả công việc đã hoàn thành
ungDung.delete('/api/todos/completed/all', async (yeuCau, phanHoi) => {
  try {
    const danhSachCongViec = await docDanhSachCongViec();
    const danhSachDaLoc = danhSachCongViec.filter(congViec => !congViec.completed);
    await ghiDanhSachCongViec(danhSachDaLoc);
    phanHoi.json({ message: 'Đã xóa tất cả công việc đã hoàn thành', deleted: danhSachCongViec.length - danhSachDaLoc.length });
  } catch (loi) {
    phanHoi.status(500).json({ message: 'Lỗi server', loi: loi.message });
  }
});

ungDung.listen(CONG, () => {
  console.log(`Server đang chạy tại http://localhost:${CONG}`);
});