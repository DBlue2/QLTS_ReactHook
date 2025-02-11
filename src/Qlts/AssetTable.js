import React from 'react';

const AssetTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full">
        <thead className="bg-blue-100">
          <tr>  
          <th className="p-3 border border-gray-300 text-center">STT</th>
            <th className="p-3 border border-gray-300 text-center">Chọn</th>
            <th className="p-3 border border-gray-300 text-center">Mã tài sản</th>
            <th className="p-3 border border-gray-300 text-center">Tên tài sản</th>
            <th className="p-3 border border-gray-300 text-center">Đơn vị tính</th>
            <th className="p-3 border border-gray-300 text-center">Nhóm tài sản</th>
            <th className="p-3 border border-gray-300 text-center">Loại tài sản</th>
            <th className="p-3 border border-gray-300 text-center">Thương hiệu</th>
            <th className="p-3 border border-gray-300 text-center">Ngày sử dụng</th>
            <th className="p-3 border border-gray-300 text-center">Mã người nhập</th>
            <th className="p-3 border border-gray-300 text-center">Tên người nhập</th>
            <th className="p-3 border border-gray-300 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.DT_QLTS_TS_ID} className="hover:bg-gray-50">
              <td className="p-2 border border-gray-300 text-center">{index + 1}</td>
              <td className="p-2 border border-gray-300 text-center">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_MaTaiSan}</td>
              <td className="p-2 border border-gray-300">{item.DT_QLTS_TS_TenTaiSan}</td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_NhapKho_DonViTinh}</td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_NhomTaiSan}</td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_LoaiTaiSan}</td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_ThuongHieu}</td>
              <td className="p-2 border border-gray-300 text-center">
                {new Date(item.DT_QLTS_TS_NgayDuaVaoSuDung).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_NhapKho_MaNhanSu}</td>
              <td className="p-2 border border-gray-300 text-center">{item.DT_QLTS_TS_NhapKho_TenKho_Ten}</td>
              <td className="p-2 border border-gray-300 text-center">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-700"
                  onClick={() => onEdit(item)}
                >
                  Sửa
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 mt-1"
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