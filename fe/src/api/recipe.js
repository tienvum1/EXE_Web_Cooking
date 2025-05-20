import axios from 'axios';

export const fetchRecipeById = async (id) => {
  const res = await axios.get(`http://localhost:4567/api/recipes/${id}`);
  return res.data;
};
