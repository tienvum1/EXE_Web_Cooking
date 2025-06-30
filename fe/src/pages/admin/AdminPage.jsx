import React, { useEffect, useState } from 'react';
import { getSummaryByMonth } from '../../api/user';
import AdminLayout from '../../layouts/AdminLayout';
import logo from '../../assets/images/logoFitMeal.png';
import { FaUserFriends, FaUtensils, FaMoneyBillWave } from 'react-icons/fa';
import './AdminPage.scss';

const getMonthOptions = () => [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const getYearOptions = () => {
  const now = new Date();
  const years = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y--) years.push(y);
  return years;
};

const AdminPage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [type, setType] = useState('month'); // 'month' | 'week' | 'day'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSummaryByMonth({ year, month, type })
      .then(res => setData(res))
      .catch(() => setError('Lỗi khi tải thống kê admin'))
      .finally(() => setLoading(false));
  }, [month, year, type]);

  // Render bảng số liệu động
  const renderTable = () => {
    if (!data) return null;
    if (type === 'day' && data.days) {
      return (
        <div className="admin-table-wrapper">
          <h3 className="admin-table-title">Thống kê từng ngày trong tháng</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Người dùng mới</th>
                <th>Công thức mới</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {data.days.map((d, idx) => (
                <tr key={idx}>
                  <td>{new Date(d.date).toLocaleDateString('vi-VN')}</td>
                  <td>{d.totalUsers}</td>
                  <td>{d.totalRecipes}</td>
                  <td>{d.totalRevenue.toLocaleString('vi-VN')} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (type === 'week' && data.weeks) {
      return (
        <div className="admin-table-wrapper">
          <h3 className="admin-table-title">Thống kê từng tuần trong tháng</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tuần</th>
                <th>Người dùng mới</th>
                <th>Công thức mới</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {data.weeks.map((w, idx) => (
                <tr key={idx}>
                  <td>{`${new Date(w.weekStart).toLocaleDateString('vi-VN')} - ${new Date(w.weekEnd).toLocaleDateString('vi-VN')}`}</td>
                  <td>{w.totalUsers}</td>
                  <td>{w.totalRecipes}</td>
                  <td>{w.totalRevenue.toLocaleString('vi-VN')} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-header">
          <img src={logo} alt="FitMeal Logo" className="admin-dashboard-logo" />
          <div>
            <h1>Thống kê tổng quan hệ thống</h1>
            <p className="admin-dashboard-desc">Chọn tháng, năm và kiểu thống kê để xem số liệu chi tiết từng ngày, từng tuần hoặc tổng tháng.</p>
          </div>
        </div>
        <div className="admin-dashboard-controls">
          <label>Tháng:</label>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="admin-dashboard-select">
            {getMonthOptions().map((m, idx) => (
              <option value={idx} key={m}>{m}</option>
            ))}
          </select>
          <label>Năm:</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="admin-dashboard-select">
            {getYearOptions().map(y => (
              <option value={y} key={y}>{y}</option>
            ))}
          </select>
          <label>Kiểu thống kê:</label>
          <select value={type} onChange={e => setType(e.target.value)} className="admin-dashboard-select">
            <option value="month">Tổng tháng</option>
            <option value="week">Theo tuần</option>
            <option value="day">Theo ngày</option>
          </select>
        </div>
        {loading ? (
          <div className="admin-stats-loading">Đang tải thống kê...</div>
        ) : error ? (
          <div className="admin-stats-error">{error}</div>
        ) : (
          <>
            {/* Card tổng tháng */}
            {data && data.type === 'month' && (
              <div className="admin-dashboard-stats-grid">
                <div className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-icon"><FaUserFriends /></div>
                  <div className="admin-dashboard-stat-label">Người dùng mới</div>
                  <div className="admin-dashboard-stat-value">{data.totalUsers}</div>
                </div>
                <div className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-icon"><FaUtensils /></div>
                  <div className="admin-dashboard-stat-label">Công thức mới</div>
                  <div className="admin-dashboard-stat-value">{data.totalRecipes}</div>
                </div>
                <div className="admin-dashboard-stat-card">
                  <div className="admin-dashboard-stat-icon"><FaMoneyBillWave /></div>
                  <div className="admin-dashboard-stat-label">Doanh thu tháng</div>
                  <div className="admin-dashboard-stat-value">{data.totalRevenue.toLocaleString('vi-VN')} đ</div>
                </div>
              </div>
            )}
            {/* Bảng động */}
            {renderTable()}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPage; 