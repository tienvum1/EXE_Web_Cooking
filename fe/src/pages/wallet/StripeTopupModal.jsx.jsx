import React, { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './StripeTopupModal.scss';
import axios from 'axios';

console.log(process.env.REACT_APP_API_URL);
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeTopupForm = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [cardName, setCardName] = useState('');
  const [country, setCountry] = useState('VN');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // 1. Gọi BE tạo PaymentIntent

      const res = await axios.post('https://exe-web-cooking.onrender.com/api/payment/stripe-create', { amount: Number(amount) }, { withCredentials: true });

      const clientSecret = res.data.clientSecret;

      // 2. Thanh toán với Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: cardName,
            address: { country }
          }
        }
      });

      if (error) {
        setMessage(error.message);

        console.error('Stripe confirmCardPayment error:', error);
      } else if (paymentIntent.status === 'succeeded') {
       
         await axios.post('https://localhost:4567/api/payment/stripe-confirm', { paymentIntentId: paymentIntent.id }, { withCredentials: true });

        setMessage('Thanh toán thành công! Đang xử lý nạp tiền...'); // Inform user it's being processed
        // Optional: Close modal immediately or after a short delay
        // setTimeout(() => { setMessage(''); setAmount(''); onClose(); }, 1800);
        // Close the modal immediately and let backend webhook handle final update/notification
         setTimeout(() => { setMessage(''); setAmount(''); onClose(); }, 2000);
      }
    } catch (err) {

      setMessage(err.response?.data?.error || err.response?.data?.message || err.message || 'Nạp tiền thất bại');
      console.error('Stripe FE error:', err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="topup-modal-form">
      <h2>Nạp tiền bằng thẻ (Stripe)</h2>
      <input
        type="number"
        min={1000}
        placeholder="Số tiền (VNĐ)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        className="topup-modal-input"
      />
      <input
        type="text"
        placeholder="Tên chủ thẻ (Cardholder Name)"
        value={cardName}
        onChange={e => setCardName(e.target.value)}
        required
        className="topup-modal-input"
        autoComplete="cc-name"
      />
      <div className="topup-modal-card">
        <label>Số thẻ</label>
        <CardNumberElement options={{ style: { base: { fontSize: '18px' } } }} />
      </div>
      <div className="topup-modal-card-row">
        <div className="topup-modal-card" style={{ flex: 1, marginRight: 8 }}>
          <label>Ngày hết hạn</label>
          <CardExpiryElement options={{ style: { base: { fontSize: '18px' } } }} />
        </div>
        <div className="topup-modal-card" style={{ flex: 1 }}>
          <label>CVC</label>
          <CardCvcElement options={{ style: { base: { fontSize: '18px' } } }} />
        </div>
      </div>
      <select
        value={country}
        onChange={e => setCountry(e.target.value)}
        className="topup-modal-input"
        required
      >
        <option value="VN">Việt Nam</option>
        <option value="US">United States</option>
        <option value="SG">Singapore</option>
        <option value="JP">Japan</option>
        <option value="KR">Korea</option>
      </select>
      <button type="submit" disabled={loading || !stripe} className="topup-modal-next-btn">
        {loading ? 'Đang xử lý...' : 'Nạp tiền'}
      </button>
      {message && <div className="topup-modal-message">{message}</div>}
    </form>
  );
};

const StripeTopupModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="topup-modal-overlay" onClick={onClose}>
      <div className="topup-modal" onClick={e => e.stopPropagation()}>
        <button className="topup-modal-close" onClick={onClose}>&times;</button>
        <Elements stripe={stripePromise}>
          <StripeTopupForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default StripeTopupModal;