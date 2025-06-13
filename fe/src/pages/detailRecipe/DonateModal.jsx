import React, { useState } from 'react';
import { FaDonate, FaTimes, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './DonateModal.scss';

const DonateModal = ({
  open,
  onClose,
  recipeId,
  authorId,
  donationType
}) => {
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
      const payload = { amount: Number(donateAmount), message: donateMsg };
      let url = `${process.env.REACT_APP_API_URL}/api/payment`;
      
      // Debug logs
      console.log('API URL:', process.env.REACT_APP_API_URL);
      console.log('Donation Type:', donationType);
      console.log('Recipe ID:', recipeId);
      console.log('Author ID:', authorId);

      if (donationType === 'recipe') {
        if (!recipeId) {
          console.error('Recipe ID is missing');
          throw new Error('Recipe ID is missing for recipe donation.');
        }
        url += '/donate-recipe';
        payload.recipeId = recipeId;
      } else if (donationType === 'blog') {
        if (!authorId) {
          console.error('Author ID is missing');
          throw new Error('Author ID is missing for blog donation.');
        }
        url += '/donate-blog-author';
        payload.authorId = authorId;
      } else {
        console.error('Invalid donation type:', donationType);
        throw new Error('Invalid donation type specified.');
      }

      console.log('Final API URL:', url);
      console.log('Request Payload:', payload);

      const response = await axios.post(url, payload, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);
      setDonateResult('success');
      setTimeout(() => {
        setDonateAmount('');
        setDonateMsg('');
        setDonateResult('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error during donation API call:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setDonateResult(err.response?.data?.message || 'Donate thất bại! Vui lòng thử lại sau.');
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