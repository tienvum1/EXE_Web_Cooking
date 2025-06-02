import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { initiateGoogleLogin, login } from '../../api/auth';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AuthPage.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);
  const [isVerificationError, setIsVerificationError] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('verificationSuccess');
    const error = searchParams.get('verificationError');

    // Log the values of success and error params
    console.log('LoginPage: URL verificationSuccess param:', success);
    console.log('LoginPage: URL verificationError param:', error);

    if (success) {
      setVerificationMessage('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setIsVerificationError(false);
      searchParams.delete('verificationSuccess');
      setSearchParams(searchParams, { replace: true });
    } else if (error) {
      setVerificationMessage('Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn.');
      setIsVerificationError(true);
      searchParams.delete('verificationError');
      setSearchParams(searchParams, { replace: true });
    }
    const loginErr = searchParams.get('error');
    if(loginErr === 'google_auth_failed') {
        setLoginError('Đăng nhập Google thất bại. Vui lòng thử lại.');
         searchParams.delete('error');
        setSearchParams(searchParams, { replace: true });
    } else if (loginErr === 'google_auth_failed_server') {
         setLoginError('Đã xảy ra lỗi máy chủ khi đăng nhập Google. Vui lòng thử lại sau.');
         searchParams.delete('error');
         setSearchParams(searchParams, { replace: true });
    }

  }, [searchParams, setSearchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    setVerificationMessage(null);

    try {
        const result = await login({ email, password });
        // Assuming successful login returns a success message or similar
        if (result && result.message === "Logged in successfully" && result.token) {
            // Login successful, store token and redirect
            localStorage.setItem('token', result.token);
            navigate('/', { replace: true });
        } else if (result && result.message) {
            // Handle specific backend messages (e.g., 'Email chưa xác minh')
            setLoginError(result.message);
        } else {
            // Generic error if no specific message is returned
            setLoginError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    } catch (error) {
        // Handle API errors (e.g., 401, 500)
        console.error('Login API error:', error);
        if (error.response && error.response.data && error.response.data.message) {
             setLoginError(error.response.data.message); // Display backend error message
        } else {
             setLoginError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'); // Generic error message
        }
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <h1 className="auth-title">Đăng nhập</h1>
        {verificationMessage && (
            <p className={isVerificationError ? 'error-message' : 'success-message'}>
                {verificationMessage}
            </p>
        )}
        <form className="auth-form" onSubmit={handleLogin}>
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
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loginError && <p className="error-message">{loginError}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="auth-separator">Hoặc</div>
        <button className="google-login-button" onClick={handleGoogleLogin} disabled={loading}>
          <i className="fab fa-google"></i> Đăng nhập bằng Google
        </button>
        <p className="auth-link">
          Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
        </p>
        <p className="auth-link">
          Quên mật khẩu? <Link to="/forgot-password">Đặt lại mật khẩu</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;