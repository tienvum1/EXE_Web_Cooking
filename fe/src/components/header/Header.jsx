import React, { useState, useRef, useEffect } from 'react';
import './Header.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
        <div className="header__logo">FitMeal</div>

        <nav className="header__nav">
          <a href="/">Home</a>
          <a href="/recipes">Recipes</a>
          <a href="/blog">Blog</a>
          <a href="/feedback">Feedback</a>
          <a href="/about">About Us</a>
          <a href="/menu-suggestion">Menu Suggestion</a>
        </nav>
        <div className="header__actions">
          <div className="header__avatar" onClick={() => setMenuOpen(!menuOpen)} style={{cursor: 'pointer'}}>
            T
          </div>
          {menuOpen && (
            <div className="header__user-menu" ref={menuRef}>
              <div className="header__user-info">
                <div className="header__avatar">T</div>
                <div>
                  <div className="header__user-name">Tiến Vũ</div>
                  <div className="header__user-username">@cook_113267840</div>
                </div>
              </div>
              <div className="header__user-menu-item"><i className="fas fa-user"></i> Bếp cá nhân</div>
              <div className="header__user-menu-item"><i className="fas fa-cog"></i> Cài đặt</div>
              <div className="header__user-menu-item"><i className="fas fa-paper-plane"></i> Gửi Góp Ý</div>
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
