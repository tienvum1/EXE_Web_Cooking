import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_API_URL/api ||
  "https://exe-web-cooking.onrender.com/api";

// Get all menus for a user
export const getUserMenus = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/menus/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user menus:", error);
    throw error;
  }
};

// Create a new menu
export const createMenu = async (menuData) => {
  try {
    const response = await axios.post(`${API_URL}/menus`, menuData);
    return response.data;
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
};

// Delete a menu
export const deleteMenu = async (menuId) => {
  try {
    const response = await axios.delete(`${API_URL}/menus/${menuId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
};

// Get a single menu by ID
export const getMenuById = async (menuId) => {
  try {
    const response = await axios.get(`${API_URL}/menus/${menuId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};

// Cập nhật thực đơn
export const updateMenu = async (menuId, menuData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/menus/${menuId}`, menuData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
