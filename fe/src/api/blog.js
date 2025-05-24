import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4567';

export const getAllBlogs = async () => {
  const res = await axios.get(`${API_URL}/api/blogs`);
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await axios.get(`${API_URL}/api/blogs/${id}`);
  return res.data;
}; 