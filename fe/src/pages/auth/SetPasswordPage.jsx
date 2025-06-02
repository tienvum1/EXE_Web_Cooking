import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setPassword } from '../../api/auth'; // Import setPassword API function
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AuthPage.scss'; // Use the shared SCSS file

const SetPasswordPage = () => {
  const [password, setPasswordState] = useState(''); // Use a different name for state variable
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
         setError('Mật khẩu phải có ít nhất 6 ký tự.');
         setLoading(false);
         return;
    }

    try {
        // Relying on the HttpOnly cookie for authentication on this endpoint
      const result = await setPassword({ password }); // Pass password object

      if (result.message) {
        setSuccess(result.message);
        // Optionally redirect after success
         setTimeout(() => {
             // Redirect to profile or homepage after setting password
             navigate('/login'); // Redirect to login after setting password
         }, 2000);

      } else {
          // Should not happen if backend sends message on success, but handle defensively
          setSuccess('Mật khẩu đã được thiết lập thành công.');
           setTimeout(() => {
              // Use the user object obtained at the top level
             navigate('/login'); // Redirect to login after setting password
           }, 2000);
      }

    } catch (err) {
      console.error('Set password failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi thiết lập mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <h1 className="auth-title">Thiết lập mật khẩu</h1>
        {success && <p className="success-message">{success}</p>}
        {!success && (
            <form className="auth-form" onSubmit={handleSetPassword}>
                <p>Vui lòng thiết lập mật khẩu cho tài khoản của bạn.</p>
                 <div className="form-group">
                    <label htmlFor="password">Mật khẩu mới</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPasswordState(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Đang thiết lập...' : 'Thiết lập mật khẩu'}
                </button>
            </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SetPasswordPage; 