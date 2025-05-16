import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AuthPage.scss';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        setError('Invalid email address.');
      } else if (password.length < 6) {
        setError('Password must be at least 6 characters.');
      } else if (name.trim().length < 2) {
        setError('Please enter your full name.');
      } else {
        setSuccess(true);
      }
    }, 1200);
  };

  const handleSocial = provider => {
    alert('Signup with ' + provider);
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <h2 className="auth-title">Create Your FitMeal Account</h2>
        {!success ? (
          <form className="auth-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
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
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <div className="auth-success">
            Registration successful! Please check your email to verify your account.
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
              Already have an account? <a href="/login">Sign In</a>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;