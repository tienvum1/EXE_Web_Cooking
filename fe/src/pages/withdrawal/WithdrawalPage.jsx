import React, { useState, useEffect } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import WithdrawalForm from '../../components/WithdrawalForm/WithdrawalForm';
import { getMe } from '../../api/auth'; // Assuming getMe can fetch current user
import './WithdrawalPage.scss'; // We will create this SCSS file next

const WithdrawalPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const user = await getMe();
        if (user) {
          setCurrentUser(user);
        } else {
          // Handle case where user is not logged in (redirect or show message)
          setError('Bạn cần đăng nhập để truy cập trang này.');
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError('Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  if (loading) return <div className="loading">Đang tải trang...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser) return null; // Or redirect to login

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="withdrawal-page">
        {/* We pass open=true and onClose to control the form from this page */}
        <WithdrawalForm
          open={true} // Always open when on this page
          onClose={() => { /* Handle close behavior - maybe navigate away */ } } // Define what close does on this page
          userId={currentUser._id}
        />
      </div>
      <Footer />
    </div>
  );
};

export default WithdrawalPage; 