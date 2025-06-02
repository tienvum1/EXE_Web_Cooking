import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import './WithdrawalForm.scss'; // We'll create this SCSS file next

const WithdrawalForm = ({ open, onClose, userId }) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch wallet balance when the form opens or user changes
  useEffect(() => {
    if (open && userId) {
      const fetchBalance = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/balance`, { withCredentials: true });
          setWalletBalance(res.data.balance);
        } catch (err) {
          console.error('Error fetching wallet balance:', err);
          setError('Không thể tải số dư ví.');
        }
      };
      fetchBalance();
    }
  }, [open, userId]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const withdrawalAmount = parseFloat(amount);

    // Frontend validation (basic)
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      setError('Số tiền rút không hợp lệ.');
      setLoading(false);
      return;
    }
    if (withdrawalAmount > walletBalance) {
       setError(`Số dư ví không đủ. Số dư hiện tại: ${walletBalance.toLocaleString('vi-VN')}đ`);
       setLoading(false);
       return;
    }
     if (!bankName || !accountNumber || !accountHolderName) {
       setError('Vui lòng điền đầy đủ thông tin ngân hàng.');
       setLoading(false);
       return;
     }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/withdraw`, {
        amount: withdrawalAmount,
        bankName,
        accountNumber,
        accountHolderName,
      }, { withCredentials: true });

      // Handle success (e.g., show a success message, clear form, close modal)
      alert(response.data.message || 'Yêu cầu rút tiền đã được gửi!');
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountHolderName('');
      setWalletBalance(prev => prev - withdrawalAmount); // Optimistically update balance
      onClose(); // Close the modal/form on success

    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu rút tiền.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdrawal-form-overlay" onClick={onClose}> {/* Overlay to close form */} 
      <div className="withdrawal-form" onClick={e => e.stopPropagation()}> {/* Prevent clicks inside from closing */} 
        <button className="withdrawal-form-close" onClick={onClose} disabled={loading}><FaTimes /></button>
        <h2>Yêu cầu rút tiền</h2>
        {error && <div className="withdrawal-error">{error}</div>}
        <div className="wallet-balance-info">
          Số dư ví hiện tại: <strong>{walletBalance.toLocaleString('vi-VN')}đ</strong>
        </div>
        <form onSubmit={handleSubmit}>
           <div className="form-group">
            <label htmlFor="amount">Số tiền muốn rút (VNĐ):</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min={1000} // Minimum withdrawal amount
            />
          </div>
          <div className="form-group">
            <label htmlFor="bankName">Tên ngân hàng:</label>
            <input
              type="text"
              id="bankName"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountNumber">Số tài khoản:</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountHolderName">Tên chủ tài khoản:</label>
            <input
              type="text"
              id="accountHolderName"
              value={accountHolderName}
              onChange={e => setAccountHolderName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}> 
            {loading ? <FaSpinner className="spinner" /> : 'Gửi yêu cầu'}
          </button>
           <button type="button" onClick={onClose} disabled={loading}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalForm; 