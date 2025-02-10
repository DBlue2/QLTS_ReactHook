import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssetTable from "./AssetTable";
import AssetModal from "./AssetModal";
import Pagination from "./Pagination";
import { assetService } from "./Api";

export default function List() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await assetService.getAllAssets();
      setData(result);
    } catch (error) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      toast.error("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (DT_QLTS_TS_ID) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài sản này?")) {
      return;
    }

    try {
      const itemToDelete = data.find(
        (item) => item.DT_QLTS_TS_ID === DT_QLTS_TS_ID
      );
      if (!itemToDelete) {
        toast.error("Không tìm thấy tài sản"); // Thêm toast ở đây
        return;
      }

      const response = await assetService.deleteAsset(itemToDelete.id);
      if (response) {
        // Kiểm tra response
        toast.success("Xóa tài sản thành công!");
        fetchData(); // Không cần await ở đây
      }
    } catch (error) {
      toast.error("Lỗi khi xóa tài sản: " + error.message);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p>{error}</p>
        <button onClick={fetchData} className="btn btn-primary mt-2">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Danh sách tài sản</h1>

      <AssetTable
        data={currentItems}
        onEdit={(asset) => {
          setSelectedAsset(asset);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={() => {
          setSelectedAsset(null);
          setIsModalOpen(true);
        }}
      >
        Thêm mới tài sản
      </button>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />

      <button
        onClick={() => toast.success("Test notification")}
        className="btn btn-secondary"
      >
        Test Toast
      </button>

      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        asset={selectedAsset}
        refreshData={fetchData}
      />

      <ToastContainer />
    </div>
  );
}
