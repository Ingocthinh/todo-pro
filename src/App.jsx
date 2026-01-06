import React, { useEffect, useState } from "react";
import FormCongViec from "./components/FormCongViec";
import DanhSachCongViec from "./components/DanhSachCongViec";
import ThongKe from "./components/ThongKe";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [danhSach, setDanhSach] = useState([]);
  const [thongKe, setThongKe] = useState(null);
  const [tuKhoa, setTuKhoa] = useState("");
  const [boLoc, setBoLoc] = useState("tatca");
  const [locTheoUuTien, setLocTheoUuTien] = useState("tatca");
  const [locTheoDanhMuc, setLocTheoDanhMuc] = useState("tatca");
  const [hienThiThongKe, setHienThiThongKe] = useState(false);

  const taiDuLieu = async () => {
    try {
      const [ketQuaCongViec, ketQuaThongKe] = await Promise.all([
        fetch(`${API_BASE_URL}/api/todos`),
        fetch(`${API_BASE_URL}/api/stats`)
      ]);
      const danhSachCongViec = await ketQuaCongViec.json();
      const duLieuThongKe = await ketQuaThongKe.json();
      
      const duLieuDaChinhSua = danhSachCongViec.map((congViec) => ({
        id: congViec.id,
        ten: congViec.text,
        hoanThanh: congViec.completed,
        uuTien: congViec.priority || 'medium',
        ngayHetHan: congViec.dueDate || null,
        danhMuc: congViec.category || 'general',
        ngayTao: congViec.createdAt,
        ngayCapNhat: congViec.updatedAt
      }));
      setDanhSach(duLieuDaChinhSua);
      setThongKe(duLieuThongKe);
    } catch (loi) {
      console.error("Lỗi tải dữ liệu:", loi);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  const themCongViec = async (ten, uuTien, ngayHetHan, danhMuc) => {
    try {
      const phanHoi = await fetch(`${API_BASE_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: ten,
          priority: uuTien || 'medium',
          dueDate: ngayHetHan || null,
          category: danhMuc || 'general'
        }),
      });
      const congViecMoi = await phanHoi.json();
      setDanhSach([
        ...danhSach,
        { 
          id: congViecMoi.id, 
          ten: congViecMoi.text, 
          hoanThanh: congViecMoi.completed,
          uuTien: congViecMoi.priority || 'medium',
          ngayHetHan: congViecMoi.dueDate || null,
          danhMuc: congViecMoi.category || 'general'
        },
      ]);
      await taiDuLieu();
    } catch (loi) {
      console.error("Lỗi thêm công việc:", loi);
    }
  };

  const doiTrangThai = async (id) => {
    const congViec = danhSach.find((congViec) => congViec.id === id);
    try {
      const phanHoi = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !congViec.hoanThanh }),
      });
      await phanHoi.json();
      await taiDuLieu();
    } catch (loi) {
      console.error("Lỗi cập nhật:", loi);
    }
  };

  const capNhatCongViec = async (id, capNhat) => {
    try {
      const phanHoi = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capNhat),
      });
      await phanHoi.json();
      await taiDuLieu();
    } catch (loi) {
      console.error("Lỗi cập nhật:", loi);
    }
  };

  const xoaCongViec = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "DELETE",
      });
      await taiDuLieu();
    } catch (loi) {
      console.error("Lỗi xóa:", loi);
    }
  };

  const xoaTatCaHoanThanh = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/todos/completed/all`, {
        method: "DELETE",
      });
      await taiDuLieu();
    } catch (loi) {
      console.error("Lỗi xóa:", loi);
    }
  };

  // Tìm kiếm công việc
  const danhSachTimKiem = danhSach.filter((congViec) =>
    congViec.ten.toLowerCase().includes(tuKhoa.toLowerCase())
  );

  // Lọc theo trạng thái hoàn thành
  const danhSachLocTrangThai = danhSachTimKiem.filter((congViec) => {
    if (boLoc === "hoanthanh") return congViec.hoanThanh;
    if (boLoc === "chuaxong") return !congViec.hoanThanh;
    return true;
  });

  // Lọc theo mức độ ưu tiên
  const danhSachLocUuTien = danhSachLocTrangThai.filter((congViec) => {
    if (locTheoUuTien === "tatca") return true;
    return congViec.uuTien === locTheoUuTien;
  });

  // Lọc theo danh mục
  const danhSachHienThi = danhSachLocUuTien.filter((congViec) => {
    if (locTheoDanhMuc === "tatca") return true;
    return congViec.danhMuc === locTheoDanhMuc;
  });

  // Lấy danh sách các danh mục duy nhất
  const danhSachDanhMuc = [...new Set(danhSach.map(congViec => congViec.danhMuc))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              TODO LIST PRO
            </h1>
            <button
              onClick={() => setHienThiThongKe(!hienThiThongKe)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
            >
              <span>{hienThiThongKe ? '' : ''}</span>
              <span>{hienThiThongKe ? 'Ẩn' : 'Hiện'} Thống Kê</span>
            </button>
          </div>

          {hienThiThongKe && thongKe && (
            <ThongKe thongKe={thongKe} />
          )}

          {/* Tìm kiếm */}
          <div className="mb-4">
            <input
              type="text"
              placeholder=" Tìm kiếm công việc..."
              value={tuKhoa}
              onChange={(suKien) => setTuKhoa(suKien.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Bộ lọc */}
          <div className="space-y-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-600 w-full">Lọc theo trạng thái:</span>
              {["tatca", "chuaxong", "hoanthanh"].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setBoLoc(loc)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    boLoc === loc
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  <span>
                    {loc === "tatca" ? "" : loc === "hoanthanh" ? "" : ""}
                  </span>
                  <span>
                    {loc === "tatca" ? "Tất cả" : loc === "hoanthanh" ? "Hoàn thành" : "Chưa xong"}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-600 w-full">Lọc theo ưu tiên:</span>
              {["tatca", "high", "medium", "low"].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocTheoUuTien(loc)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    locTheoUuTien === loc
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  }`}
                >
                  <span>
                    {loc === "tatca" ? "" : loc === "high" ? "🔴" : loc === "medium" ? "🟡" : "🟢"}
                  </span>
                  <span>
                    {loc === "tatca" ? "Tất cả" : loc === "high" ? "Cao" : loc === "medium" ? "Trung bình" : "Thấp"}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-600 w-full">Lọc theo danh mục:</span>
              <button
                onClick={() => setLocTheoDanhMuc("tatca")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                  locTheoDanhMuc === "tatca"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                <span></span>
                <span>Tất cả</span>
              </button>
              {danhSachDanhMuc.map((danhMuc) => (
                <button
                  key={danhMuc}
                  onClick={() => setLocTheoDanhMuc(danhMuc)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                    locTheoDanhMuc === danhMuc
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  <span>🏷️</span>
                  <span>{danhMuc}</span>
                </button>
              ))}
            </div>
          </div>

          <FormCongViec themCongViec={themCongViec} />

          {danhSach.filter(congViec => congViec.hoanThanh).length > 0 && (
            <button
              onClick={xoaTatCaHoanThanh}
              className="w-full mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              <span>🗑️</span>
              <span>Xóa tất cả đã hoàn thành</span>
              <span className="bg-red-500 px-2 py-1 rounded-full text-xs">
                ({danhSach.filter(congViec => congViec.hoanThanh).length})
              </span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <DanhSachCongViec
            danhSach={danhSachHienThi}
            doiTrangThai={doiTrangThai}
            xoaCongViec={xoaCongViec}
            capNhatCongViec={capNhatCongViec}
          />

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              <span className="font-bold text-red-600">Tổng: {danhSach.length}</span> | 
              <span className="text-green-600"> Hoàn thành: {danhSach.filter(congViec => congViec.hoanThanh).length}</span> | 
              <span className="text-orange-600"> Chưa xong: {danhSach.filter(congViec => !congViec.hoanThanh).length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
