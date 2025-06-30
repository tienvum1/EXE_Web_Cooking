import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../api/transaction';
import './TransactionHistory.scss';

const formatAmount = (amount) => amount.toLocaleString('vi-VN') + 'đ';

const AdminTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (err) {
        setError('Không thể tải lịch sử giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper để hiển thị tên user nếu có populate, nếu không thì hiển thị ID
  const renderUser = (user) => {
    if (!user) return '-';
    if (typeof user === 'string') return user;
    return user.fullName || user.username || user.email || user._id || '-';
  };

  return (
    <div className="transaction-history-admin-container">
      <h2>Lịch sử giao dịch toàn hệ thống</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Loại</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Người gửi</th>
                <th>Người nhận</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center' }}>Chưa có giao dịch nào</td></tr>
              )}
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                  <td>
                    {tx.type === 'topup' ? 'Nạp tiền' :
                     tx.type === 'withdraw-request' ? 'Rút tiền' :
                     tx.type === 'donate' ? 'Donate' :
                     tx.type === 'donate-blog' ? 'Donate Blog' :
                     tx.type}
                  </td>
                  <td>{formatAmount(tx.amount)}</td>
                  <td>{tx.method || '-'}</td>
                  <td>
                    {tx.status === 'success' ? 'Thành công' :
                     tx.status === 'pending' ? 'Chờ duyệt' :
                     tx.status === 'approved' ? 'Đã duyệt' :
                     tx.status === 'rejected' ? 'Đã từ chối' :
                     tx.status === 'completed' ? 'Hoàn thành' :
                     tx.status}
                  </td>
                  <td>{renderUser(tx.from)}</td>
                  <td>{renderUser(tx.to)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionHistory; 