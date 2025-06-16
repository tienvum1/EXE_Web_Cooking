import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__intro">
            <h3>Về <span className="highlight">FitMeal</span></h3>
            <p>
              FitMeal truyền cảm hứng <strong>sống khỏe & ăn ngon mỗi ngày</strong>.
              Kết nối cộng đồng yêu ẩm thực, chia sẻ công thức và xây dựng lối sống lành mạnh.
            </p>
          </div>

          <div className="footer__social">
          <a 
      href="https://www.facebook.com/people/Live-Long-Live-Well/61577165199079" 
      aria-label="Facebook" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FaFacebookF />
    </a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        {/* ✅ THÊM DÒNG PREMIUM Ở ĐÂY */}
        <div className="footer__premium-message">
          Đăng ký <a href="#premium"><strong>gói Premium</strong></a> để truy cập các chức năng và quyền lợi dành riêng khác!
        </div>

        <div className="footer__links">
          <a href="#premium">Gói Premium</a>
          <a href="#career">Sự Nghiệp</a>
          <a href="#feedback">Góp Ý</a>
          <a href="#posts">Bài Viết</a>
          <a href="#terms">Điều Khoản</a>
          <a href="#guide">Hướng Dẫn</a>
          <a href="#privacy">Chính Sách</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="footer__bottom">
          <p>© {currentYear} FitMeal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
