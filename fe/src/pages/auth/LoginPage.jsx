import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AuthPage.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Fake async
    setTimeout(() => {
      setLoading(false);
      if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        setError('Invalid email address.');
      } else if (password.length < 6) {
        setError('Password must be at least 6 characters.');
      } else {
        // TODO: Gọi API đăng nhập
        alert('Login success!');
      }
    }, 1200);
  };

  const handleSocial = provider => {
    alert('Login with ' + provider);
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2 className="auth-title">Sign In to FitMeal</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-forgot">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-or">or</div>
        <div className="auth-social">
          <button className="auth-social-btn fb" onClick={() => handleSocial('Facebook')} disabled={loading}>
            <i className="fab fa-facebook-f"></i> Continue with Facebook
          </button>
          <button className="auth-social-btn gg" onClick={() => handleSocial('Google')} disabled={loading}>
            <i className="fab fa-google"></i> Continue with Google
          </button>
        </div>
        <div className="auth-bottom">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;