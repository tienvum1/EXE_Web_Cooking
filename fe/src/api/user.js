import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:4567';

export const getCurrentUser = async () => {
  const res = await axios.get(`${API_URL}/api/users/me`, { withCredentials: true });
  return res.data;
};

export const fetchUserById = async (id) => {
  const res = await axios.get(`${API_URL}/api/users/${id}`,{ withCredentials: true });
  return res.data;
};

export const getUserWithRecipes = async (id) => {
  const res = await axios.get(`${API_URL}/api/users/${id}/recipes`, { withCredentials: true });
  return res.data;
};