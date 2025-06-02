import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.scss'; // Use the shared SCSS file
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';


const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Đang xác thực email...');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Không tìm thấy token xác thực trong liên kết.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      setIsLoading(true);
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://localhost:4567";
        if (!backendUrl) {
            setMessage('Lỗi cấu hình: Không tìm thấy URL backend (REACT_APP_BACKEND_URL).');
            setIsError(true);
            setIsLoading(false);
            return;
        }

        const apiUrl = `${backendUrl}/api/auth/verify-email?token=${token}`;

        console.log('Frontend: Attempting to verify email with API URL:', apiUrl);

        const response = await axios.get(apiUrl);

        setMessage(response.data.message || 'Xác thực email thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');
        setIsError(false);

        setTimeout(() => {
          navigate('/login?verificationSuccess=true');
        }, 3000);

      } catch (error) {
        console.error('Frontend: Lỗi xác thực email:', error.response?.data || error.message);
        setIsError(true);
        if (error.response) {
          setMessage(`Xác thực thất bại: ${error.response.data.message || error.response.statusText}`);
        } else {
          setMessage('Đã xảy ra lỗi trong quá trình xác thực.');
        }
        setTimeout(() => {
          navigate('/login?verificationError=true');
        }, 3000);

      } finally {
        setIsLoading(false);
        console.log('Frontend: Verify email request finished.');
      }
    };

    verifyEmail();

  }, [searchParams, navigate]);

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <h2>Xác thực email</h2>
        {isLoading ? (
          <p>Đang xử lý...</p>
        ) : (
          <p className={isError ? 'error-message' : 'success-message'}>{message}</p>
        )}
        {!isLoading && (
          <p className="auth-link"><Link to="/login">Đi đến trang Đăng nhập</Link></p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmailPage; 