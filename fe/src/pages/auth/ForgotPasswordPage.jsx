import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import '../auth/AuthPage.scss'; // Reuse auth page styles
import { initiatePasswordReset } from '../../api/auth'; // Import the API function

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // TODO: Call backend API to initiate password reset
      console.log('Initiating password reset for email:', email);
      // Assume a successful response returns a message
      // setMessage('Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email đó.');
      const response = await initiatePasswordReset(email);
      setMessage(response.message);
    } catch (err) {
      console.error('Forgot password request failed:', err);
      // Assume an error response provides a message
      setError('Đã xảy ra lỗi khi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <h1 className="auth-title">Quên mật khẩu</h1>
        <p>Vui lòng nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;