import React from "react";
import CongViec from "./CongViec";

function DanhSachCongViec({ danhSach, doiTrangThai, xoaCongViec, capNhatCongViec }) {
  if (!danhSach || danhSach.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">📝 Chưa có công việc nào.</p>
        <p className="text-gray-400 text-sm mt-2">Thêm công việc mới để bắt đầu!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {danhSach.map((congViec) => (
        <CongViec
          key={congViec.id}
          congViec={congViec}
          doiTrangThai={doiTrangThai}
          xoaCongViec={xoaCongViec}
          capNhatCongViec={capNhatCongViec}
        />
      ))}
    </ul>
  );
}

export default DanhSachCongViec;