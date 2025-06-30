import React, { useEffect, useState } from 'react';
import { getTotalUsers, getTotalRecipes, getTotalRevenue } from '../../api/user';
import './AdminPage.scss';

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [users, recipes, revenue] = await Promise.all([
          getTotalUsers(),
          getTotalRecipes(),
          getTotalRevenue(),
        ]);
        setStats({
          totalUsers: users.totalUsers,
          totalRecipes: recipes.totalRecipes,
          totalRevenue: revenue.totalRevenue,
        });
      } catch (err) {
        setError('Lỗi khi tải thống kê admin');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-stats-loading">Đang tải thống kê...</div>;
  if (error) return <div className="admin-stats-error">{error}</div>;

  return (
    <div className="admin-stats-container">
      <h2>Thống kê hệ thống</h2>
      <div className="admin-stats-grid">
        <div className="admin-stats-card">
          <h3>Tổng số người dùng</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="admin-stats-card">
          <h3>Tổng số công thức</h3>
          <p>{stats.totalRecipes}</p>
        </div>
        <div className="admin-stats-card">
          <h3>Tổng doanh thu</h3>
          <p>{stats.totalRevenue.toLocaleString('vi-VN')} đ</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 