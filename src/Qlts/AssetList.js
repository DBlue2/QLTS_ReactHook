import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssetTable from "./AssetTable";
import AssetModal from "./AssetModal";
import Pagination from "./Pagination";
import { assetService } from "./Api";

export default function List() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      setError(null);
      const result = await assetService.getAllAssets();
      setData(result);
    } catch (error) {
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      toast.error("Lỗi khi tải dữ liệu: " + error.message);
    } finally {
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
        throw new Error("Không tìm thấy tài sản");
      }

      await assetService.deleteAsset(itemToDelete.id);
      toast.success("Xóa tài sản thành công!");
      await fetchData(); // Đảm bảo dữ liệu được làm mới
    } catch (error) {
      toast.error("Lỗi khi xóa tài sản: " + error.message);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
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
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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