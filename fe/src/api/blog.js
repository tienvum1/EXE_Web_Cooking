import axios from 'axios';

export const getAllBlogs = async () => {
  const res = await axios.get('http://localhost:4567/api/blogs');
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await axios.get(`http://localhost:4567/api/blogs/${id}`);
  return res.data;
}; 