import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL || 'https://localhost:4567'; // Use your backend URL

// Function to handle donation
export const donate = async ({ authorId, amount }) => {
    try {
        const response = await axios.post(`${API_URL}/api/payment/donate`, {
            authorId: authorId,
            amount: amount
        }, {
            withCredentials: true // Ensure cookies are sent
        });
        return response.data; // Assuming backend returns a success message or data
    } catch (error) {
        console.error('Error during donation API call:', error);
        throw error; // Re-throw to be handled by the component
    }
}; 