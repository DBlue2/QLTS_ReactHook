const API_URL = 'http://localhost:4000/DSTaiSan';

export const assetService = {
  // Lấy danh sách tài sản
  getAllAssets: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  },

  // Xóa tài sản
  deleteAsset: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete asset');
    }
    return response.json();
  },

  // Kiểm tra trùng lặp mã tài sản
  checkDuplicateMaTaiSan: async (value, currentId = '') => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return !data.find(
      item => item.DT_QLTS_TS_MaTaiSan === value && item.id !== currentId
    );
  },

  // Kiểm tra trùng lặp serial number
  checkDuplicateSerialNumber: async (value, currentId = '') => {
    if (!value) return true;
    const response = await fetch(API_URL);
    const data = await response.json();
    return !data.find(
      item => item.DT_QLTS_TS_SerialNumber === value && item.id !== currentId
    );
  },
  
  // Tạo hoặc cập nhật tài sản
  saveAsset: async (values, isEditing, currentId) => {
    const paddedId = values.DT_QLTS_TS_MaTaiSan.padStart(9, '0');
    const DT_QLTS_TS_ID = parseInt(paddedId);

    const url = isEditing ? `${API_URL}/${currentId}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...values, 
        id: isEditing ? currentId : Date.now().toString(),
        DT_QLTS_TS_ID
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save asset');
    }
    return response.json();
  }
};