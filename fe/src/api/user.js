import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_API_URL ||
  "https://exe-web-cooking.onrender.com";

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_URL}/api/users/me`, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchUserById = async (id) => {
  const res = await axios.get(`${API_URL}/api/users/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getUserWithRecipes = async (id) => {
  const res = await axios.get(`${API_URL}/api/users/${id}/recipes`, {
    withCredentials: true,
  });
  return res.data;
};

// Function to follow a user
export const followUser = async (userIdToFollow) => {
  try {
    // Make a POST request to the backend follow endpoint
    // The backend will identify the current user via the cookie
    console.log("userIdToFollow", userIdToFollow);
    const response = await axios.post(
      `${API_URL}/api/users/${userIdToFollow}/follow`,
      {},
      {
        withCredentials: true, // Essential for sending the token cookie
      }
    );
    return response.data; // Assuming backend returns a success message or status
  } catch (error) {
    console.error(`Error following user ${userIdToFollow}:`, error);
    // Handle specific error statuses (e.g., already following, user not found)
    throw error; // Re-throw to be handled by the calling component
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    // Make a PUT request to the backend user update endpoint
    // The backend should verify that the authenticated user is updating their own profile
    const response = await axios.put(
      `${API_URL}/api/users/${userId}`,
      userData,
      {
        withCredentials: true, // Essential for sending the token cookie
      }
    );
    return response.data; // Assuming backend returns the updated user data
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    // Handle errors (e.g., validation errors, unauthorized)
    throw error; // Re-throw to be handled by the calling component
  }
};

// Function to change user password
export const changePassword = async (passwordData) => {
  try {
    // Make a PUT request to the backend password change endpoint
    // The backend will identify the current user via the cookie and verify the old password
    const response = await axios.put(
      `${API_URL}/api/users/change-password`,
      passwordData,
      {
        withCredentials: true, // Essential for sending the token cookie
      }
    );
    return response.data; // Assuming backend returns a success message
  } catch (error) {
    console.error("Error changing password:", error);
    // Handle errors (e.g., incorrect old password, validation errors)
    throw error; // Re-throw to be handled by the calling component
  }
};

export const updateUserAvatar = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
