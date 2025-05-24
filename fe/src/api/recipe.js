import axios from 'axios';

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:4567';
=======
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4567';
>>>>>>> 951e2b41db4e422a23f49156e1cfb7e0a0129458

export const fetchRecipeById = async (id) => {
  const res = await axios.get(`${API_URL}/api/recipes/${id}`);
  return res.data;
};

export const fetchNewestRecipes = async () => {
  const res = await axios.get(`${API_URL}/api/recipes/newest`);
  return res.data;
};

export const fetchMostLikedRecipes = async () => {
  const res = await axios.get(`${API_URL}/api/recipes/most-liked`);
  return res.data;
};
