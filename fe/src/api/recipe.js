import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:4567';


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
