import React, { useEffect, useState } from 'react';
import { getTotalUsers, getTotalRecipes, getTotalRevenue, getRevenueByPeriod } from '../../api/user';
import axios from 'axios';
import './AdminPage.scss';

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalRevenue: 0,
    pendingTopup: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Thêm state cho doanh thu theo mốc thời gian
  const [periodType, setPeriodType] = useState('day');
  const [periodRevenue, setPeriodRevenue] = useState(0);
  const [loadingPeriod, setLoadingPeriod] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [users, recipes, revenue] = await Promise.all([
          getTotalUsers(),
          getTotalRecipes(),
          getTotalRevenue(),
        ]);
        const pendingRes = await axios.get('https://exe-web-cooking.onrender.com/api/transactions/pending-topup', {
          withCredentials: true,
        });
        setStats({
          totalUsers: users.totalUsers,
          totalRecipes: recipes.totalRecipes,
          totalRevenue: revenue.totalRevenue,
          pendingTopup: Array.isArray(pendingRes.data) ? pendingRes.data.length : 0,
        });
      } catch (err) {
        setError('Lỗi khi tải thống kê admin');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchPeriodRevenue = async () => {
      setLoadingPeriod(true);
      try {
        const res = await getRevenueByPeriod(periodType);
        setPeriodRevenue(res.totalRevenue || 0);
      } catch {
        setPeriodRevenue(0);
      } finally {
        setLoadingPeriod(false);
      }
    };
    fetchPeriodRevenue();
  }, [periodType]);

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
        <div className="admin-stats-card">
          <h3>Topup chờ duyệt</h3>
          <p>{stats.pendingTopup}</p>
        </div>
      </div>
      <div className="admin-period-revenue">
        <h3>Doanh thu theo mốc thời gian</h3>
        <select value={periodType} onChange={e => setPeriodType(e.target.value)}>
          <option value="day">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
        </select>
        <div className="admin-period-revenue-value">
          {loadingPeriod ? 'Đang tải...' : `${periodRevenue.toLocaleString('vi-VN')} đ`}
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 