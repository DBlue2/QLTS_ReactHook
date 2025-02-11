import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { assetService } from "./Api";

const apiURL = "http://localhost:4000/DSTaiSan";

const AssetModal = ({ isOpen, onClose, asset, refreshData }) => {
  const isEditing = !!asset;

  // Generate year options from 1990 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year);
    }
    return years;
  };

  // Custom validation function for checking duplicate MaTaiSan
  const checkDuplicateMaTaiSan = async (value) => {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      const duplicate = data.find(
        item => item.DT_QLTS_TS_MaTaiSan === value && item.id !== (asset?.id || '')
      );
      return !duplicate;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return true;
    }
  };

  // Custom validation function for checking duplicate SerialNumber
  const checkDuplicateSerialNumber = async (value) => {
    if (!value) return true;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      const duplicate = data.find(
        item => item.DT_QLTS_TS_SerialNumber === value && item.id !== (asset?.id || '')
      );
      return !duplicate;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return true;
    }
  };

  // Schema xác thực dữ liệu
  const validationSchema = Yup.object({
    DT_QLTS_TS_MaTaiSan: Yup.string()
      .required("Mã tài sản bắt buộc")
      .matches(/^[0-9]+$/, "Mã tài sản chỉ được chứa số")
      .test("unique", "Mã tài sản đã tồn tại", checkDuplicateMaTaiSan),
    DT_QLTS_TS_TenTaiSan: Yup.string()
      .required("Tên tài sản bắt buộc")
      .matches(/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/, "Tên tài sản chỉ được chứa chữ và số"),
    DT_QLTS_TS_SerialNumber: Yup.string()
      .required("Serial Number bắt buộc")
      .test("unique", "Serial Number đã tồn tại", checkDuplicateSerialNumber),
    DT_QLTS_TS_NamSanXuat: Yup.number("")
      .min(1990, "Năm sản xuất không được nhỏ hơn 1990")
      .max(new Date().getFullYear(), "Năm sản xuất không được lớn hơn năm hiện tại"),
      DT_QLTS_TS_KichThuoc_Dai: Yup.number()
      .min(0, "Chiều dài không được âm"),
    DT_QLTS_TS_KichThuoc_Rong: Yup.number()
      .min(0, "Chiều rộng không được âm"),
    DT_QLTS_TS_KichThuoc_Cao: Yup.number()
      .min(0, "Chiều cao không được âm"),
  });

  // Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: asset || {
      DT_QLTS_TS_PBQL: "",
      DT_QLTS_TS_NhomTaiSan: "",
      DT_QLTS_TS_LoaiTaiSan: "",
      DT_QLTS_TS_PhongHienTai: "",
      DT_QLTS_TS_TenPhongHienTai: "",
      DT_QLTS_TS_MaTaiSan: "",
      DT_QLTS_TS_TenTaiSan: "",
      DT_QLTS_TS_MaNhomThietBiDiKem: "",
      DT_QLTS_TS_NguonGoc: "",
      DT_QLTS_TS_TinhTrang: "",
      DT_QLTS_TS_MoTa: "",
      DT_QLTS_TS_Model: "",
      DT_QLTS_TS_ThuongHieu: "",
      DT_QLTS_TS_NamSanXuat: new Date().getFullYear(),
      DT_QLTS_TS_NgayDuaVaoSuDung: "",
      DT_QLTS_TS_XuatXu: "",
      DT_QLTS_TS_SerialNumber: "",
      DT_QLTS_TS_KichThuoc_Dai: 0,
      DT_QLTS_TS_KichThuoc_Rong: 0,
      DT_QLTS_TS_KichThuoc_Cao: 0,
      DT_QLTS_TS_GiayToKemTheo_TenFile: "",
      DT_QLTS_TS_GiayToKemTheo_DataFile: "",
      DT_QLTS_TS_TS_GhiChu: "",
      DT_QLTS_TS_NhapKho_MaNhanSu: "",
      DT_QLTS_TS_NhapKho_TenKho: "",
      DT_QLTS_TS_NhapKho_TenKho_Ten: "",
      DT_QLTS_TS_NhapKho_DonViTinh: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await assetService.saveAsset(values, isEditing, asset?.id);
        toast.success(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        await refreshData();
        onClose();
      } catch (error) {
        console.error("Lỗi khi gửi request:", error);
        toast.error(error.message || "Lỗi khi lưu dữ liệu!");
      }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? "Sửa tài sản" : "Thêm tài sản mới"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={formik.handleSubmit}>
              {/* Row 1 - Required fields */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Mã tài sản<span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.DT_QLTS_TS_MaTaiSan && formik.errors.DT_QLTS_TS_MaTaiSan ? "is-invalid" : ""}`}
                    {...formik.getFieldProps("DT_QLTS_TS_MaTaiSan")}
                  />
                  <div className="invalid-feedback">{formik.errors.DT_QLTS_TS_MaTaiSan}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tên tài sản<span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.DT_QLTS_TS_TenTaiSan && formik.errors.DT_QLTS_TS_TenTaiSan ? "is-invalid" : ""}`}
                    {...formik.getFieldProps("DT_QLTS_TS_TenTaiSan")}
                  />
                  <div className="invalid-feedback">{formik.errors.DT_QLTS_TS_TenTaiSan}</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Serial Number<span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.DT_QLTS_TS_SerialNumber && formik.errors.DT_QLTS_TS_SerialNumber ? "is-invalid" : ""}`}
                    {...formik.getFieldProps("DT_QLTS_TS_SerialNumber")}
                  />
                  <div className="invalid-feedback">{formik.errors.DT_QLTS_TS_SerialNumber}</div>
                </div>
              </div>
  
              {/* Row 2 - Basic Information */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Nhóm tài sản</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_NhomTaiSan")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Loại tài sản</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_LoaiTaiSan")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_Model")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Thương hiệu</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_ThuongHieu")}
                  />
                </div>
              </div>
  
              {/* Row 3 - Location Information */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Phòng ban quản lý</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_PBQL")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Phòng hiện tại</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_PhongHienTai")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tên phòng hiện tại</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_TenPhongHienTai")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Mã nhóm thiết bị đi kèm</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_MaNhomThietBiDiKem")}
                  />
                </div>
              </div>
  
              {/* Row 4 - Product Information */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Nguồn gốc</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_NguonGoc")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Xuất xứ</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_XuatXu")}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Năm sản xuất</label>
                  <select
                    className="form-select"
                    {...formik.getFieldProps("DT_QLTS_TS_NamSanXuat")}
                  >
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Ngày đưa vào sử dụng</label>
                  <input
                    type="date"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_NgayDuaVaoSuDung")}
                  />
                </div>
              </div>
  
              {/* Row 5 - Dimensions */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Chiều dài (cm)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_KichThuoc_Dai")}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Chiều rộng (cm)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_KichThuoc_Rong")}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Chiều cao (cm)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_KichThuoc_Cao")}
                  />
                </div>
              </div>
  
              {/* Row 6 - Status and Description */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Tình trạng</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_TinhTrang")}
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    {...formik.getFieldProps("DT_QLTS_TS_MoTa")}
                  />
                </div>
              </div>
  
              {/* Row 7 - Warehouse Information */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Mã nhân sự nhập kho</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_NhapKho_MaNhanSu")}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tên kho</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_NhapKho_TenKho")}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Đơn vị tính</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps("DT_QLTS_TS_NhapKho_DonViTinh")}
                  />
                </div>
              </div>
  
              {/* Row 8 - Additional Information */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    {...formik.getFieldProps("DT_QLTS_TS_TS_GhiChu")}
                  />
                </div>
              </div>
  
              {/* Row 9 - File Attachment */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">Giấy tờ kèm theo</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("DT_QLTS_TS_GiayToKemTheo_TenFile", file?.name || "");
                      // Handle file data separately if needed
                    }}
                  />
                </div>
              </div>
  
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Đóng
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;