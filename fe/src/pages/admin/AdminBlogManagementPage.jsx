import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminBlogManagementPage.scss'; // Corrected import

const AdminBlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, {
          withCredentials: true,
        });
        setBlogs(res.data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Không thể tải danh sách blog.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa blog này không?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/blogs/${blogId}`, {
          withCredentials: true,
        });
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        alert('Blog đã được xóa thành công!');
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Lỗi khi xóa blog.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page-content">
      <h2>Quản lý Blog</h2>
      <Link to="/admin/create-blog" className="create-new-button">Tạo Blog Mới</Link>
      {blogs.length === 0 ? (
        <p>Không có blog nào để hiển thị.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.authorName || 'N/A'}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/blogs/edit/${blog._id}`} className="action-button edit">Sửa</Link>
                  <button onClick={() => handleDeleteBlog(blog._id)} className="action-button delete">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBlogManagementPage; 