import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthPage.scss';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:4567';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'https://localhost:4567/api/auth/login',
        { username, password },
        { withCredentials: true }
      );
      // Không cần lưu token, cookie sẽ tự động được gửi kèm các request sau
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2 className="auth-title">Đăng nhập FitMeal</h2>
        <form className="auth-form" onSubmit={handleLogin}>
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
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-bottom">
          Chưa có tài khoản? <a href="/signup">Đăng ký</a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;