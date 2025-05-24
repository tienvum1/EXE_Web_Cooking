import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.scss';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:4567';

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (username.trim().length < 6) {
      setError('Tên đăng nhập phải có ít nhất 6 ký tự.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        password
      });
      setSuccess(true);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = provider => {
    alert('Signup with ' + provider);
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2 className="auth-title">Tạo tài khoản FitMeal</h2>
        {!success ? (
          <form className="auth-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
        ) : (
          <div className="auth-success">
            Đăng ký thành công! Đang chuyển sang trang đăng nhập...
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}
        {!success && (
          <>
            <div className="auth-or">or</div>
            <div className="auth-social">
              <button className="auth-social-btn fb" onClick={() => handleSocial('Facebook')} disabled={loading}>
                <i className="fab fa-facebook-f"></i> Sign up with Facebook
              </button>
              <button className="auth-social-btn gg" onClick={() => handleSocial('Google')} disabled={loading}>
                <i className="fab fa-google"></i> Sign up with Google
              </button>
            </div>
            <div className="auth-bottom">
              Đã có tài khoản? <a href="/login">Đăng nhập</a>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;