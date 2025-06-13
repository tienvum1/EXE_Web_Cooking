import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


// Đăng ký gói premium
export const subscribePremium = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/premium/subscribe`, {
            amount: 25000, // Giá cố định 25.000đ
            type:'register_premium',
            transferContent: 'register_premium'
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi khi đăng ký gói premium' };
    }
};

// Kiểm tra trạng thái premium
export const checkPremiumStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/premium/status`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi khi kiểm tra trạng thái premium' };
    }
};
