import React, { useState } from 'react';
import { FaDonate, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './DonateModal.scss';

const DonateModal = ({ open, onClose, recipeId }) => {
  const [donateAmount, setDonateAmount] = useState('');
  const [donateMsg, setDonateMsg] = useState('');
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateResult, setDonateResult] = useState('');

  if (!open) return null;

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonateLoading(true);
    setDonateResult('');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/donate`,
        { recipeId, amount: Number(donateAmount), message: donateMsg },
        { withCredentials: true }
      );
      setDonateResult('success');
      setTimeout(() => {
        setDonateAmount('');
        setDonateMsg('');
        setDonateResult('');
        onClose();
      }, 1500);
    } catch (err) {
      setDonateResult(err.response?.data?.message || 'Donate thất bại!');
    } finally {
      setDonateLoading(false);
    }
  };

  return (
    <div className="donate-modal-overlay" onClick={onClose}>
      <div className="donate-modal" onClick={e => e.stopPropagation()}>
        <button className="donate-modal-close" onClick={onClose}><FaTimes /></button>
        <div className="donate-modal-header">
          <FaDonate className="donate-modal-icon" />
          <h3>Ủng hộ tác giả</h3>
        </div>
        <form className="donate-modal-form" onSubmit={handleDonate}>
          <label>Số tiền (VNĐ)</label>
          <input
            type="number"
            min={1000}
            placeholder="Nhập số tiền muốn donate"
            value={donateAmount}
            onChange={e => setDonateAmount(e.target.value)}
            required
            className="donate-modal-input"
          />
          <label>Lời nhắn (không bắt buộc)</label>
          <textarea
            placeholder="Gửi lời nhắn tới tác giả..."
            value={donateMsg}
            onChange={e => setDonateMsg(e.target.value)}
            className="donate-modal-input"
            rows={3}
          />
          <button
            type="submit"
            className="donate-modal-submit"
            disabled={donateLoading || !donateAmount}
          >
            {donateLoading ? <FaSpinner className="donate-modal-spinner" /> : 'Gửi donate'}
          </button>
          <button type="button" className="donate-modal-cancel" onClick={onClose} disabled={donateLoading}>Hủy</button>
        </form>
        {donateResult && (
          <div className={donateResult === 'success' ? 'donate-modal-success' : 'donate-modal-error'}>
            {donateResult === 'success' ? 'Donate thành công!' : donateResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateModal; 