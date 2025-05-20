import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Lấy thông tin user khi header mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:4567/api/users/me', { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>FitMeal</div>

        <nav className="header__nav">
          <a href="/">Home</a>
          
          <a href="/recipes">Recipes</a>
          
          <a href="/blog">Blog</a>
          <a href="/menu-suggestion">Menu Suggestion</a>
          <div className="header__dropdown">
            <span
              className="header__dropdown-toggle"
              tabIndex={0}
            >
              Công cụ tính các chỉ số
            </span>
            <div className="header__dropdown-menu">
              <a href="/tools/bmi">Công cụ tính BMI</a>
              <a href="/tools/weight">Công cụ tính cân nặng chuẩn</a>
              <a href="/tools/bmr-tdee">Công cụ tính BMR và TDEE</a>
            </div>
          </div>
          <a href="/about">About Us</a>
        </nav>
        <div className="header__actions">
          <div className="header__avatar" onClick={() => setMenuOpen(!menuOpen)} style={{cursor: 'pointer'}}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" />
              : (user?.username ? user.username[0].toUpperCase() : 'U')}
          </div>
          {menuOpen && (
            <div className="header__user-menu" ref={menuRef}>
              <div className="header__user-info">
                <div className="header__avatar">
                  {user?.avatar
                    ? <img src={user.avatar} alt="avatar" />
                    : (user?.username ? user.username[0].toUpperCase() : 'U')}
                </div>
                <div>
                  <div className="header__user-name">{user?.fullName || user?.username || 'Khách'}</div>
                  <div className="header__user-username">{user ? `@${user.username}` : ''}</div>
                </div>
              </div>
              <div
                className="header__user-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-user"></i> Bếp cá nhân
              </div>
              <div
                className="header__user-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/settings');
                }}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-cog"></i> Cài đặt
              </div>
              <div
                className="header__user-menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/feedback');
                }}
                style={{ cursor: 'pointer' }}
              >
                <i className="fas fa-paper-plane"></i> Gửi Góp Ý
              </div>
              <div className="header__user-menu-divider"></div>
              <div className="header__user-menu-item header__user-menu-logout"><i className="fas fa-sign-out-alt"></i> Thoát</div>
            </div>
          )}
          <button className="header__new-recipe-btn" onClick={() => navigate('/recipes/create')}>
            <i className="fas fa-pen"></i> Viết món mới
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
