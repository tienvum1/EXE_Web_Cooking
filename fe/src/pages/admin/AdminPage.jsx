import React, { useEffect, useState } from 'react';
import { getSummaryByPeriod } from '../../api/user';
import './AdminPage.scss';

const AdminPage = () => {
  // State cho doanh thu, user, recipe theo tuần/tháng
  const [periodType, setPeriodType] = useState('week');
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await getSummaryByPeriod(periodType);
        setSummary({
          totalUsers: res.totalUsers,
          totalRecipes: res.totalRecipes,
          totalRevenue: res.totalRevenue,
        });
      } catch {
        setError('Lỗi khi tải thống kê admin');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [periodType]);

  if (loading) return <div className="admin-stats-loading">Đang tải thống kê...</div>;
  if (error) return <div className="admin-stats-error">{error}</div>;

  return (
    <div className="admin-stats-container">
      <h2>Thống kê hệ thống</h2>
      <div className="admin-stats-grid">
        <div className="admin-stats-card">
          <h3>Tổng số người dùng</h3>
          <p>{summary.totalUsers}</p>
        </div>
        <div className="admin-stats-card">
          <h3>Tổng số công thức</h3>
          <p>{summary.totalRecipes}</p>
        </div>
        <div className="admin-stats-card">
          <h3>Doanh thu ({periodType === 'week' ? 'tuần này' : 'tháng này'})</h3>
          <div style={{ marginBottom: 8 }}>
            <select value={periodType} onChange={e => setPeriodType(e.target.value)}>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
          <p>{summary.totalRevenue.toLocaleString('vi-VN')} đ</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 