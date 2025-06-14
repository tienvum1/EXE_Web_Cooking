import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import './AdminWithdrawalsPage.scss'; // We'll create this SCSS file

const AdminWithdrawalsPage = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithdrawalRequests = async () => {
    try {
      setLoading(true);
      // Fetch only pending withdrawal requests
      const res = await axios.get(`https://exe-web-cooking.onrender.com/api/payment/withdrawals?status=pending`, { withCredentials: true });
      setWithdrawalRequests(res.data);
    } catch (err) {
      console.error('Error fetching withdrawal requests:', err);
      setError('Không thể tải danh sách yêu cầu rút tiền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      // Call the backend API to update the status
      await axios.put(`https://exe-web-cooking.onrender.com/api/payment/withdrawals/${id}/status`, { status }, { withCredentials: true });
      // Refresh the list after updating
      fetchWithdrawalRequests();
      alert(`Yêu cầu đã được ${status === 'approved' ? 'duyệt' : 'từ chối'}.`);
    } catch (err) {
      console.error(`Error updating withdrawal status to ${status}:`, err);
      setError(`Không thể cập nhật trạng thái yêu cầu. ${err.response?.data?.message || 'Lỗi server.'}`);
    }
  };

  if (loading) return <AdminLayout><div className="loading">Đang tải yêu cầu rút tiền...</div></AdminLayout>;
  if (error) return <AdminLayout><div className="error">{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-withdrawals-page">
        <h2>Yêu cầu rút tiền chờ duyệt ({withdrawalRequests.length})</h2>

        {withdrawalRequests.length === 0 ? (
          <p>Không có yêu cầu rút tiền nào chờ duyệt.</p>
        ) : (
          <table className="withdrawals-table">
            <thead>
              <tr>
                <th>Người yêu cầu</th>
                <th>Số tiền (VNĐ)</th>
                <th>Ngân hàng</th>
                <th>Số tài khoản</th>
                <th>Tên chủ TK</th>
                <th>Ngày yêu cầu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.from?.fullName || request.from?.username || 'N/A'}</td>
                  <td>{request.amount.toLocaleString('vi-VN')}</td>
                  <td>{request.bankName}</td>
                  <td>{request.accountNumber}</td>
                  <td>{request.accountHolderName}</td>
                  <td>{format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === 'pending' && (
                      <>
                        <button className="approve-btn" onClick={() => handleUpdateStatus(request._id, 'approved')}>Duyệt</button>
                        <button className="reject-btn" onClick={() => handleUpdateStatus(request._id, 'rejected')}>Từ chối</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminWithdrawalsPage; 