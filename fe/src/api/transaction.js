import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_API_URL ||
  "https://exe-web-cooking.onrender.com";

// Lấy lịch sử giao dịch
export const getTransactionHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/transactions/history`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Có lỗi xảy ra khi lấy lịch sử giao dịch"
    );
  }
};

// Tạo giao dịch nạp tiền mới
export const createTopupTransaction = async (
  amount,
  transferContent,
  bankInfo
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/transactions/topup`,
      {
        amount,
        transferContent,
        bankInfo,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Lấy danh sách yêu cầu nạp tiền đang chờ (Admin)
export const getPendingTopupRequests = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/transactions/pending-topup`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xử lý yêu cầu nạp tiền (Admin)
export const handleTopupRequest = async (transactionId, action) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/transactions/topup/${transactionId}`,
      { action },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
