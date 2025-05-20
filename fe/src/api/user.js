import axios from 'axios';

export const getCurrentUser = async () => {
  const res = await axios.get('http://localhost:4567/api/users/me', { withCredentials: true });
  return res.data;
};

export const fetchUserById = async (id) => {
  const res = await axios.get(`http://localhost:4567/api/users/${id}`,{ withCredentials: true });
  return res.data;
};

export const getUserWithRecipes = async (id) => {
  const res = await axios.get(`http://localhost:4567/api/users/${id}/recipes`, { withCredentials: true });
  return res.data;
};