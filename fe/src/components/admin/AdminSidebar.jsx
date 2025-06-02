import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.scss';
const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h3>Admin Dashboard</h3>
      <ul>
        <li>
          <Link to="/admin">Tổng quan</Link>
        </li>
        <li>
          <Link to="/admin/create-blog">Tạo Bài Blog Mới</Link>
        </li>

        <li>
          <Link to="/admin/recipes/pendings">Phê Duyệt Recipe</Link>
        </li>
        <li>
          <Link to="/admin/withdrawals">Yêu cầu rút tiền</Link>
        </li>
        {/* Add more admin links here */}
      </ul>
    </div>
  );
};

export default AdminSidebar; 