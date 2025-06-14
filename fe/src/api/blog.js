import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_API_URL ||
  "https://exe-web-cooking.onrender.com";

export const getAllBlogs = async () => {
  const res = await axios.get(`${API_URL}/api/blogs`);
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await axios.get(`${API_URL}/api/blogs/${id}`);
  return res.data;
};
