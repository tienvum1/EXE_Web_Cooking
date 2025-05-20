import axios from 'axios';

export const getCurrentUser = async () => {
  const res = await axios.get('http://localhost:4567/api/users/me', { withCredentials: true });
  return res.data;
};