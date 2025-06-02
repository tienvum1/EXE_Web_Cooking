import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionHistory.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';

const fetchHistory = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/transactions/history`,
    { withCredentials: true }
  );
  return res.data;
};

const formatAmount = (amount) => amount.toLocaleString('vi-VN') + 'đ';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchHistory();
        setTransactions(data);
      } catch (err) {
        setError('Không thể tải lịch sử giao dịch.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    <Header />
    <Sidebar />
    <div className="transaction-history-container">
      <h2>Lịch sử giao dịch</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Loại</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Chưa có giao dịch nào</td></tr>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>  
    <Footer />
    </>
  );
};

export default TransactionHistory; 