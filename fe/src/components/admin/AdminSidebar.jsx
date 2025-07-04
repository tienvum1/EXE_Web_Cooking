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
          <Link to="/admin/blogs">Quản lý Blog</Link>
        </li>
        <li>
          <Link to="/admin/recipes/pendings">Phê Duyệt Recipe</Link>
        </li>
        <li>
          <Link to="/admin/topup-requests">Yêu cầu nạp tiền</Link>
        </li>
        <li>
          <Link to="/admin/withdrawals">Yêu cầu rút tiền</Link>
        </li>
        <li>
          <Link to="/admin/transaction-history">Lịch sử giao dịch</Link>
        </li>
        {/* Add more admin links here */}
      </ul>
    </div>
  );
};

export default AdminSidebar; 