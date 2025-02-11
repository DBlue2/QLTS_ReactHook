const API_URL = "http://localhost:4000/DSTaiSan";

export const assetService = {
  // Lấy danh sách tài sản
  getAllAssets: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  },

  // Xóa tài sản
  deleteAsset: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete asset");
    }
    return response.json();
  },

  saveAsset: async (values, isEditing, currentId) => {
    if (!isEditing) {
      const response = await fetch(API_URL);
      const data = await response.json();

      // Tìm mã tài sản lớn nhất hiện tại
      const maxCode = data.reduce((max, item) => {
        const code = parseInt(item.DT_QLTS_TS_MaTaiSan) || 0;
        return code > max ? code : max;
      }, 0);
      values.DT_QLTS_TS_ID = maxCode + 1;
      values.id = Date.now().toString();
    }

    const url = isEditing ? `${API_URL}/${currentId}` : API_URL;
    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Failed to save asset");
    }
    return response.json();
  },
};
