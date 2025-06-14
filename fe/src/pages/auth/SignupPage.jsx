import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import { useAuth } from '../../context/AuthContext'; // Remove useAuth hook import
import axios from 'axios'; // Import axios
import validator from 'validator'; // Import validator
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import './AuthPage.scss'; // Use the same shared SCSS file

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [phone, setPhone] = useState(''); // Assuming phone is optional
  // const [error, setError] = useState(null); // Remove error state
  // const [success, setSuccess] = useState(null); // Remove success state
  const [message, setMessage] = useState(''); // Add message state
  const [isError, setIsError] = useState(false); // Add isError state
  const [showPassword, setShowPassword] = useState(false); // Add showPassword state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add showConfirmPassword state
  // const [loading, setLoading] = useState(false); // Remove loading state

  // const { registerUser, isAuthenticated } = useAuth(); // Remove useAuth hook usage
  const navigate = useNavigate();

   // Remove check for isAuthenticated
   // if (isAuthenticated) {
   //  navigate('/', { replace: true });
   //  return null; // Prevent rendering signup form
   // }

  const handleSignup = async (e) => {
    e.preventDefault();
    // setLoading(true); // Remove loading state usage
    setMessage(''); // Clear messages
    setIsError(false); // Clear error state
    // setError(null); // Remove error state usage
    // setSuccess(null); // Remove success state usage

    if (!validator.isEmail(email)) {
      setMessage('Email không đúng định dạng.');
      setIsError(true);
      // setLoading(false); // Remove loading state usage
      return;
    }

    if (password.length < 8) { // Assuming minimum length 8 from provided code
      setMessage('Mật khẩu phải có ít nhất 8 ký tự.');
      setIsError(true);
      // setLoading(false); // Remove loading state usage
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      setIsError(true);
      // setLoading(false); // Remove loading state usage
      return;
    }

    try {
      // Use axios directly for API call
      // Construct the full API URL by appending the auth route and register path
      const backendUrl = 'https://exe-web-cooking.onrender.com' ; // Use the base backend URL variable
      if (!backendUrl) {
          // Handle case where backend URL is not set
          setMessage('Lỗi cấu hình: Không tìm thấy URL backend (REACT_APP_BACKEND_URL).');
          setIsError(true);
          return;
      }
      const apiUrl = `${backendUrl}/api/auth/register`; // Explicitly append auth route and register path
      console.log('Attempting registration with API URL:', apiUrl); // Log the API URL
      const response = await axios.post(apiUrl, { name, email, password /*, phone */ }); // Include phone if needed, commented out for now

      setMessage(response.data.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh.'); // Use backend message or default
      setIsError(false);
      // setSuccess(result.message); // Remove success state usage

      // Optionally, redirect to login page after successful registration
       setTimeout(() => {
           navigate('/login');
       }, 3000); // Redirect after 3 seconds

    } catch (error) {
      console.error('Đăng ký thất bại:', error.response?.data || error.message); // Log error
      setIsError(true);
      const errorMessage = error.response?.data?.message
        ? `Đăng ký thất bại: ${error.response.data.message}`
        : 'Đã xảy ra lỗi trong quá trình đăng ký.';
      setMessage(errorMessage); // Set error message
      // setError(result.message); // Remove error state usage
    }
    // setLoading(false); // Remove loading state usage
  };

  // Add password toggle functions
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Remove social login handler if not needed
  // const handleSocial = provider => {
  //   alert('Signup with ' + provider);
  // };

  return (
    <div className="auth-page"> {/* Using existing AuthPage classes */}
      <Header />
      <div className="auth-container"> {/* Using existing AuthPage classes */}
        <h1 className="auth-title">Đăng ký tài khoản</h1>
        {message && ( // Display message based on state
            <p className={`message ${isError ? 'error' : 'success'}`}> {/* Use message and isError state */}
                {message}
            </p>
        )}
        {/* Remove success message rendering */}
        {/* {success && <p className="success-message">{success}</p>} */}

        <form className="auth-form" onSubmit={handleSignup}> {/* Using existing AuthPage classes */}
          <div className="form-group"> {/* Using existing AuthPage classes */}
            <label htmlFor="name">Tên của bạn</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group"> {/* Using existing AuthPage classes */}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
           {/* Include phone field if needed */}
           {/* <div className="form-group"> */}
           {/*  <label htmlFor="phone">Số điện thoại (Tùy chọn)</label> */}
           {/*  <input */}
           {/*    type="tel" */}
           {/*    id="phone" */}
           {/*    value={phone} */}
           {/*    onChange={(e) => setPhone(e.target.value)} */}
           {/*  /> */}
           {/* </div> */}
          <div className="form-group"> {/* Using existing AuthPage classes */}
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-group"> {/* Add password input group for toggle */}
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <div className="form-group"> {/* Using existing AuthPage classes */}
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
             <div className="password-input-group"> {/* Add password input group for toggle */}
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8} // Add minLength attribute
              />
               <span
                className="password-toggle" // Add password toggle span
                onClick={toggleConfirmPasswordVisibility}
              >
                 {showConfirmPassword ? '🙈' : '👁️'} {/* Toggle icon */}
               </span>
            </div>
          </div>

          {/* Remove error message rendering */}
          {/* {error && <p className="error-message">{error}</p>} */}
          
          <button type="submit" className="auth-button"> {/* Using existing AuthPage classes, maybe adjust styling in SCSS */}
            {/* {loading ? 'Đang đăng ký...' : 'Đăng ký'} */} Đăng ký {/* Remove loading state usage */}
          </button>
        </form>

        <p className="auth-link"> {/* Using existing AuthPage classes */}
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;