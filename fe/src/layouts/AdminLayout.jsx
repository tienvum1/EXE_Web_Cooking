import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
// import './AdminLayout.scss'; // You'll need to create this SCSS file

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 