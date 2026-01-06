import React, { useState } from "react";
import ChonNgay from "./ChonNgay";

function FormCongViec({ themCongViec }) {
  const [ten, setTen] = useState("");
  const [uuTien, setUuTien] = useState("medium");
  const [ngayHetHan, setNgayHetHan] = useState("");
  const [danhMuc, setDanhMuc] = useState("general");
  const [hienThiChiTiet, setHienThiChiTiet] = useState(false);

  const xuLySubmit = (suKien) => {
    suKien.preventDefault();
    if (!ten.trim()) return;
    themCongViec(ten, uuTien, ngayHetHan || null, danhMuc);
    setTen("");
    setUuTien("medium");
    setNgayHetHan("");
    setDanhMuc("general");
    setHienThiChiTiet(false);
  };

  return (
    <form onSubmit={xuLySubmit} className="mb-4">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={ten}
          onChange={(suKien) => setTen(suKien.target.value)}
          placeholder="Nhập công việc..."
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
        />
        <button
          type="button"
          onClick={() => setHienThiChiTiet(!hienThiChiTiet)}
          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all flex items-center gap-1"
          title={hienThiChiTiet ? "Ẩn chi tiết" : "Hiện chi tiết"}
        >
          {hienThiChiTiet ? "-" : "+"}
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-semibold flex items-center gap-2"
        >
          <span>+</span>
          <span>Thêm</span>
        </button>
      </div>

      {hienThiChiTiet && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ⚡ Ưu tiên
            </label>
            <select
              value={uuTien}
              onChange={(suKien) => setUuTien(suKien.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="low">🟢 Thấp</option>
              <option value="medium">🟡 Trung bình</option>
              <option value="high">🔴 Cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              📅 Ngày hết hạn
            </label>
            <ChonNgay
              giaTri={ngayHetHan}
              thayDoi={setNgayHetHan}
              placeholder="Chọn ngày hết hạn"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              🏷️ Danh mục
            </label>
            <input
              type="text"
              value={danhMuc}
              onChange={(suKien) => setDanhMuc(suKien.target.value)}
              placeholder="Nhập danh mục..."
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default FormCongViec;

