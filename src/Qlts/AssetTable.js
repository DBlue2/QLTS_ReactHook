import React from 'react';

const AssetTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover table-striped">
        <thead className="table-primary text-center align-middle">
          <tr>
            <th>STT</th>
            <th>Chọn</th>
            <th>Mã tài sản</th>
            <th>Tên tài sản</th>
            <th>Đơn vị tính</th>
            <th>Nhóm tài sản</th>
            <th>Loại tài sản</th>
            <th>Thương hiệu</th>
            <th>Ngày đưa vào sử dụng</th>
            <th>Mã người nhập</th>
            <th>Tên người nhập</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.DT_QLTS_TS_ID}>
              <td className="p-2 text-center">{index + 1}</td>
              <td className="p-2 text-center">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_MaTaiSan}</td>
              <td className="p-2">{item.DT_QLTS_TS_TenTaiSan}</td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_NhapKho_DonViTinh}</td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_NhomTaiSan}</td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_LoaiTaiSan}</td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_ThuongHieu}</td>
              <td className="p-2 text-center">
                {new Date(item.DT_QLTS_TS_NgayDuaVaoSuDung).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_NhapKho_MaNhanSu}</td>
              <td className="p-2 text-center">{item.DT_QLTS_TS_NhapKho_TenKho_Ten}</td>
              <td className="p-2 text-center">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-700"
                  onClick={() => onEdit(item)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mt-1"
                  onClick={() => onDelete(item.DT_QLTS_TS_ID)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;