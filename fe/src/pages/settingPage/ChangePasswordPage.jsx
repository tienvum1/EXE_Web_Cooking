import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import './ChangePasswordPage.scss'; // Import the SCSS file
// import { changePassword } from '../../api/user'; // TODO: Import API function

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Basic frontend validation
    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu mới không khớp.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
        setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
        setLoading(false);
        return;
    }
    if (!oldPassword) {
        setError('Vui lòng nhập mật khẩu cũ.');
        setLoading(false);
        return;
    }

    try {
      // TODO: Call backend API to change password
      console.log('Attempting to change password', { oldPassword, newPassword });
      // const response = await changePassword({ oldPassword, newPassword });
      // setMessage(response.message);
      setMessage('Password change request sent (API call not integrated yet).'); // Placeholder
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

    } catch (err) {
      console.error('Change password failed:', err);
      // setError(err.response?.data?.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu.'); // Display backend error or generic
      setError('Đã xảy ra lỗi khi thay đổi mật khẩu (API call not integrated yet).'); // Placeholder
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Sidebar /> {/* Assuming sidebar is part of the settings layout */}
      <div className="change-password-page">
        <h2>Thay đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Mật khẩu cũ:</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ChangePasswordPage; 