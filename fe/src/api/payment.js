import axios from "axios";

const API_URL = "https://exe-web-cooking.onrender.com";

// Function to handle donation
export const donate = async ({ authorId, amount }) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payment/donate`,
      {
        authorId: authorId,
        amount: amount,
      },
      {
        withCredentials: true, // Ensure cookies are sent
      }
    );
    return response.data; // Assuming backend returns a success message or data
  } catch (error) {
    console.error("Error during donation API call:", error);
    throw error; // Re-throw to be handled by the component
  }
};
