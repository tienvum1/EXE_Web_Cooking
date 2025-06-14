import axios from "axios";

// Assuming your backend is running on https://localhost:4567 (or the PORT in your .env)
// and your authentication routes are under /api/auth
const API_URL =
  process.env.REACT_APP_BACKEND_API_URL ||
  "https://exe-web-cooking.onrender.com";

// Function to register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}api/auth/register`, userData);
  // Optionally, return data or just success statusc
  return response.data;
};

// Function to login user with email and password
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}api/auth/login`, credentials, {
    withCredentials: true,
  });
  // Server sets HttpOnly cookie, so we don't get the token here directly
  // We might get user info back in the response body
  return response.data; // Return full response data including potentially token
};

// Function to logout user
export const logout = async () => {
  try {
    // The backend will clear the HttpOnly cookie
    const response = await axios.post(
      `${API_URL}api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during logout API call:", error);
    // Even if logout fails on the API call level, we might want to clear frontend state
    // Depending on desired UX
    throw error;
  }
};

// Function to initiate Google Login
export const initiateGoogleLogin = () => {
  // Redirect the browser to the backend's Google OAuth initiation route
  window.location.href = `${API_URL}api/auth/google`;
};

// Function to fetch logged-in user details (requires token cookie)
export const getMe = async () => {
  // axios automatically sends cookies associated with the domain
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (!token) {
    // Handle case where token is not found (user not logged in)
    throw new Error("No authentication token found");
  }
  const response = await axios.get(`${API_URL}api/auth/me`, {
    withCredentials: true, // Keep this for potential HttpOnly cookie fallback/compatibility
    headers: {
      Authorization: `Bearer ${token}`, // Add Authorization header
    },
  });
  return response.data;
};

// Function to set password (e.g., after Google login)
// Requires a token (potentially from URL or another source, or just relying on cookie)
export const setPassword = async (passwordData, token = null) => {
  let config = {};
  // If a token is explicitly passed (e.g., from a verification link),
  // use it in the Authorization header. Otherwise, rely on the HttpOnly cookie.
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const response = await axios.post(
    `${API_URL}api/auth/set-password`,
    passwordData,
    config
  );
  return response.data;
};

// Function to initiate password reset
export const initiatePasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}api/users/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error initiating password reset:", error);
    throw error; // Re-throw to be handled by the component
  }
};

// Function to reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}api/auth/reset-password/${token}`,
      { password: newPassword }
    );
    return response.data; // Assuming backend sends a success message
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error; // Re-throw to be handled by the component
  }
};

// Note: Email verification is typically handled by the backend redirecting the browser
// to a frontend page with query parameters (e.g., /verify-email?token=...)
// The frontend page then calls a backend API to verify the token.
// In this setup, the backend's verifyEmail handler already redirects, so the frontend verify-email page
// might only need to display success/error messages based on URL query params.
