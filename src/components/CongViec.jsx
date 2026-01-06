import React, { useState } from "react";
import ChonNgay from "./ChonNgay";

function CongViec({ congViec, doiTrangThai, xoaCongViec, capNhatCongViec }) {
  const [dangChinhSua, setDangChinhSua] = useState(false);
  const [tenMoi, setTenMoi] = useState(congViec.ten);
  const [uuTienMoi, setUuTienMoi] = useState(congViec.uuTien || "medium");
  const [ngayHetHanMoi, setNgayHetHanMoi] = useState(congViec.ngayHetHan || "");
  const [danhMucMoi, setDanhMucMoi] = useState(congViec.danhMuc || "general");

  const luuChinhSua = () => {
    if (!tenMoi.trim()) return;
    capNhatCongViec(congViec.id, {
      text: tenMoi.trim(),
      priority: uuTienMoi,
      dueDate: ngayHetHanMoi || null,
      category: danhMucMoi || "general"
    });
    setDangChinhSua(false);
  };

  const huyChinhSua = () => {
    setTenMoi(congViec.ten);
    setUuTienMoi(congViec.uuTien || "medium");
    setNgayHetHanMoi(congViec.ngayHetHan || "");
    setDanhMucMoi(congViec.danhMuc || "general");
    setDangChinhSua(false);
  };

  const mauUuTien = {
    high: "bg-red-100 text-red-700 border-red-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    low: "bg-green-100 text-green-700 border-green-300"
  };

  const iconUuTien = {
    high: "🔴",
    medium: "🟡",
    low: "🟢"
  };

  const kiemTraQuaHan = () => {
    if (!congViec.ngayHetHan || congViec.hoanThanh) return false;
    return new Date(congViec.ngayHetHan) < new Date();
  };

  const quaHan = kiemTraQuaHan();

  if (dangChinhSua) {
    return (
      <li className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl shadow-md">
        <div className="space-y-3">
          <input
            type="text"
            value={tenMoi}
            onChange={(suKien) => setTenMoi(suKien.target.value)}
            className="w-full border-2 border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              value={uuTienMoi}
              onChange={(suKien) => setUuTienMoi(suKien.target.value)}
              className="border-2 border-blue-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value="low">🟢 Thấp</option>
              <option value="medium">🟡 Trung bình</option>
              <option value="high">🔴 Cao</option>
            </select>
            <ChonNgay
              giaTri={ngayHetHanMoi}
              thayDoi={setNgayHetHanMoi}
              placeholder="Chọn ngày"
            />
            <input
              type="text"
              value={danhMucMoi}
              onChange={(suKien) => setDanhMucMoi(suKien.target.value)}
              placeholder="Danh mục"
              className="border-2 border-blue-300 rounded-lg px-2 py-1 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={luuChinhSua}
              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>Lưu</span>
            </button>
            <button
              onClick={huyChinhSua}
              className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <span>✕</span>
              <span>Hủy</span>
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`flex flex-col gap-2 p-4 rounded-xl border-2 shadow-sm transition-all hover:shadow-md ${
        congViec.hoanThanh
          ? "bg-gray-50 border-gray-200"
          : quaHan
          ? "bg-red-50 border-red-300"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={congViec.hoanThanh}
          onChange={() => doiTrangThai(congViec.id)}
          className="w-5 h-5 mt-1 text-red-500 rounded focus:ring-red-400 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-medium ${
                congViec.hoanThanh
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {congViec.ten}
            </span>
            {quaHan && !congViec.hoanThanh && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                 QUÁ HẠN
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full border ${mauUuTien[congViec.uuTien] || mauUuTien.medium}`}
            >
              {iconUuTien[congViec.uuTien] || "🟡"} {congViec.uuTien === "high" ? "Cao" : congViec.uuTien === "medium" ? "Trung bình" : "Thấp"}
            </span>
            {congViec.ngayHetHan && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-300">
                📅 {new Date(congViec.ngayHetHan).toLocaleDateString("vi-VN")}
              </span>
            )}
            {congViec.danhMuc && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-300">
                🏷️ {congViec.danhMuc}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDangChinhSua(true)}
            className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-all"
            title="Chỉnh sửa"
          >
            ✏️
          </button>
          <button
            onClick={() => xoaCongViec(congViec.id)}
            className="text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>
    </li>
  );
}

export default CongViec;

