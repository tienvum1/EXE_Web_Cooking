import React from 'react';
import './SettingPage.scss';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';

const settings = [
  'Tài khoản',
  'Điều chỉnh chức năng thông báo',
  'Điều khoản Dịch Vụ và Chính sách',
  'Những câu hỏi thường gặp',
  'Góp Ý',
  'Tải ứng dụng Fitmeal để tham gia cộng đồng nấu ăn tại gia lớn nhất Việt Nam!',
  'Cộng tác với Fitmeal',
];

const SettingPage = () => (
  <div>
    <Header />
    <Sidebar />
  <div className="setting-modal-overlay" style={{position: 'static', background: 'none', minHeight: '100vh'}}>
    <div className="setting-modal">
      <h2 className="setting-title">Cài đặt ứng dụng</h2>
      <ul className="setting-list">
        {settings.map((item, idx) => (
          <li className="setting-item" key={idx}>
            {item}
            <span className="setting-arrow">{'>'}</span>
          </li>
        ))}
      </ul>
      <button className="setting-logout-btn">Thoát</button>
    </div>
  </div>
  <Footer />
  </div>
);

export default SettingPage;