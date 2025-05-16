import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AuthPage.scss';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleForgot = e => {
    e.preventDefault();
    setError('');
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    // TODO: Gửi yêu cầu quên mật khẩu tới server
    setSent(true);
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2 className="auth-title">Forgot Password</h2>
        <form className="auth-form" onSubmit={handleForgot}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={sent}
          />
          <button className="auth-btn" type="submit" disabled={sent}>
            {sent ? 'Sent!' : 'Send Reset Link'}
          </button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        {sent && (
          <div className="auth-success">
            If this email is registered, you will receive a password reset link shortly.
          </div>
        )}
        <div className="auth-bottom">
          <a href="/login">Back to Sign In</a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPasswordPage;