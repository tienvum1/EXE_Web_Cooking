import axios from 'axios';

export const fetchRecipeById = async (id) => {
  const res = await axios.get(`http://localhost:4567/api/recipes/${id}`);
  return res.data;
};

export const fetchNewestRecipes = async () => {
  const res = await axios.get('http://localhost:4567/api/recipes/newest');
  return res.data;
};

export const fetchMostLikedRecipes = async () => {
  const res = await axios.get('http://localhost:4567/api/recipes/most-liked');
  return res.data;
};
