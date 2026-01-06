import React from "react";

function ThongKe({ thongKe }) {
  if (!thongKe) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
         Thống Kê
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{thongKe.total}</div>
          <div className="text-sm text-gray-600">Tổng số</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{thongKe.completed}</div>
          <div className="text-sm text-gray-600">Hoàn thành</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{thongKe.pending}</div>
          <div className="text-sm text-gray-600">Chưa xong</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-600">{thongKe.overdue}</div>
          <div className="text-sm text-gray-600">Quá hạn</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Theo Ưu Tiên</h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-red-600">🔴 Cao:</span>
              <span className="font-bold">{thongKe.byPriority.high || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">🟡 Trung bình:</span>
              <span className="font-bold">{thongKe.byPriority.medium || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">🟢 Thấp:</span>
              <span className="font-bold">{thongKe.byPriority.low || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Theo Danh Mục</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Object.keys(thongKe.byCategory).length === 0 ? (
              <p className="text-gray-500 text-sm">Chưa có danh mục</p>
            ) : (
              Object.entries(thongKe.byCategory).map(([danhMuc, soLuong]) => (
                <div key={danhMuc} className="flex justify-between">
                  <span className="text-blue-600">{danhMuc}:</span>
                  <span className="font-bold">{soLuong}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongKe;

