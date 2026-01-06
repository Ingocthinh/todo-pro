import React, { useState } from "react";

function ChonNgay({ giaTri, thayDoi, placeholder = "Chọn ngày" }) {
  const [hienThi, setHienThi] = useState(false);
  const [ngayHienTai, setNgayHienTai] = useState(() => {
    if (giaTri) {
      const ngay = new Date(giaTri);
      return { thang: ngay.getMonth(), nam: ngay.getFullYear() };
    }
    const bayGio = new Date();
    return { thang: bayGio.getMonth(), nam: bayGio.getFullYear() };
  });

  const ngayDuocChon = giaTri ? new Date(giaTri) : null;

  const chuyenThang = (huong) => {
    setNgayHienTai((truoc) => {
      let thangMoi = truoc.thang + huong;
      let namMoi = truoc.nam;

      if (thangMoi < 0) {
        thangMoi = 11;
        namMoi--;
      } else if (thangMoi > 11) {
        thangMoi = 0;
        namMoi++;
      }

      return { thang: thangMoi, nam: namMoi };
    });
  };

  const chonNgay = (ngay) => {
    const ngayMoi = new Date(ngayHienTai.nam, ngayHienTai.thang, ngay);
    const chuoiNgay = ngayMoi.toISOString().split("T")[0];
    thayDoi(chuoiNgay);
    setHienThi(false);
  };

  const xoaNgay = (suKien) => {
    suKien.stopPropagation();
    thayDoi("");
    setHienThi(false);
  };

  const laySoNgayTrongThang = (thang, nam) => {
    return new Date(nam, thang + 1, 0).getDate();
  };

  const layNgayDauTuan = (thang, nam) => {
    return new Date(nam, thang, 1).getDay();
  };

  const tenThang = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const tenThu = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const soNgay = laySoNgayTrongThang(ngayHienTai.thang, ngayHienTai.nam);
  const ngayDauTuan = layNgayDauTuan(ngayHienTai.thang, ngayHienTai.nam);
  const ngayHomNay = new Date();
  const ngayHienTaiChuan = new Date(ngayHienTai.nam, ngayHienTai.thang);

  const taoMangNgay = () => {
    const mangNgay = [];
    const soNgayTruoc = ngayDauTuan;
    
    // Ngày của tháng trước
    const thangTruoc = ngayHienTai.thang === 0 ? 11 : ngayHienTai.thang - 1;
    const namTruoc = ngayHienTai.thang === 0 ? ngayHienTai.nam - 1 : ngayHienTai.nam;
    const soNgayThangTruoc = laySoNgayTrongThang(thangTruoc, namTruoc);
    
    for (let i = soNgayTruoc - 1; i >= 0; i--) {
      mangNgay.push({
        ngay: soNgayThangTruoc - i,
        thuocThangHienTai: false,
        ngayThang: new Date(namTruoc, thangTruoc, soNgayThangTruoc - i)
      });
    }
    
    // Ngày của tháng hiện tại
    for (let i = 1; i <= soNgay; i++) {
      mangNgay.push({
        ngay: i,
        thuocThangHienTai: true,
        ngayThang: new Date(ngayHienTai.nam, ngayHienTai.thang, i)
      });
    }
    
    // Ngày của tháng sau (để đủ 6 tuần)
    const soNgayConLai = 42 - mangNgay.length;
    const thangSau = ngayHienTai.thang === 11 ? 0 : ngayHienTai.thang + 1;
    const namSau = ngayHienTai.thang === 11 ? ngayHienTai.nam + 1 : ngayHienTai.nam;
    
    for (let i = 1; i <= soNgayConLai; i++) {
      mangNgay.push({
        ngay: i,
        thuocThangHienTai: false,
        ngayThang: new Date(namSau, thangSau, i)
      });
    }
    
    return mangNgay;
  };

  const kiemTraNgayHienTai = (ngayThang) => {
    const homNay = new Date();
    return (
      ngayThang.getDate() === homNay.getDate() &&
      ngayThang.getMonth() === homNay.getMonth() &&
      ngayThang.getFullYear() === homNay.getFullYear()
    );
  };

  const kiemTraNgayDuocChon = (ngayThang) => {
    if (!ngayDuocChon) return false;
    return (
      ngayThang.getDate() === ngayDuocChon.getDate() &&
      ngayThang.getMonth() === ngayDuocChon.getMonth() &&
      ngayThang.getFullYear() === ngayDuocChon.getFullYear()
    );
  };

  const kiemTraQuaKhu = (ngayThang) => {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);
    return ngayThang < homNay;
  };

  return (
    <div className="relative">
      <div
        onClick={() => setHienThi(!hienThi)}
        className="flex items-center gap-2 cursor-pointer border-2 border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 transition-all bg-white"
      >
        <span className="text-gray-500">📅</span>
        <input
          type="text"
          readOnly
          value={
            ngayDuocChon
              ? ngayDuocChon.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : placeholder
          }
          className="flex-1 outline-none cursor-pointer text-gray-700"
          placeholder={placeholder}
        />
        {ngayDuocChon && (
          <button
            onClick={xoaNgay}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Xóa ngày"
          >
            ✕
          </button>
        )}
      </div>

      {hienThi && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setHienThi(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-20 p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => chuyenThang(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Tháng trước"
              >
                ◀
              </button>
              <div className="text-center">
                <div className="font-bold text-gray-800">
                  {tenThang[ngayHienTai.thang]} {ngayHienTai.nam}
                </div>
              </div>
              <button
                onClick={() => chuyenThang(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Tháng sau"
              >
                ▶
              </button>
            </div>

            {/* Tên các thứ */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {tenThu.map((thu) => (
                <div
                  key={thu}
                  className="text-center text-xs font-semibold text-gray-600 py-1"
                >
                  {thu}
                </div>
              ))}
            </div>

            {/* Lịch */}
            <div className="grid grid-cols-7 gap-1">
              {taoMangNgay().map((item, index) => {
                const laNgayHienTai = kiemTraNgayHienTai(item.ngayThang);
                const laNgayDuocChon = kiemTraNgayDuocChon(item.ngayThang);
                const laQuaKhu = kiemTraQuaKhu(item.ngayThang);

                return (
                  <button
                    key={index}
                    onClick={() => !laQuaKhu && item.thuocThangHienTai && chonNgay(item.ngay)}
                    disabled={laQuaKhu || !item.thuocThangHienTai}
                    className={`
                      aspect-square p-1 rounded-lg text-sm transition-all
                      ${
                        laNgayDuocChon
                          ? "bg-blue-500 text-white font-bold"
                          : laNgayHienTai
                          ? "bg-blue-100 text-blue-700 font-bold"
                          : item.thuocThangHienTai
                          ? laQuaKhu
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-700 hover:bg-blue-50 cursor-pointer"
                          : "text-gray-300"
                      }
                    `}
                  >
                    {item.ngay}
                  </button>
                );
              })}
            </div>

            {/* Nút nhanh */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => {
                  const homNay = new Date();
                  const chuoiNgay = homNay.toISOString().split("T")[0];
                  thayDoi(chuoiNgay);
                  setHienThi(false);
                }}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Hôm nay
              </button>
              <button
                onClick={() => {
                  const ngayMai = new Date();
                  ngayMai.setDate(ngayMai.getDate() + 1);
                  const chuoiNgay = ngayMai.toISOString().split("T")[0];
                  thayDoi(chuoiNgay);
                  setHienThi(false);
                }}
                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Ngày mai
              </button>
              <button
                onClick={() => setHienThi(false)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChonNgay;

