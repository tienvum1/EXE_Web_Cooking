import React, { useState, useRef, useEffect, useContext } from 'react';
import './Header.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import TopupModal from '../../pages/wallet/StripeTopupModal.jsx';
import { getMe, logout } from '../../api/auth';
import RecipeContext from '../../contexts/RecipeContext';
import axios from 'axios';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); 
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [showTopup, setShowTopup] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [hasNewTransactions, setHasNewTransactions] = useState(false);

  const location = useLocation();

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

  // Function to refresh user data - expose this for external calls
  const refreshUserData = async () => {
    try {
      const userData = await getMe();
      console.log('Header: Refreshing user data:', userData);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getMe();
        console.log('Header: User data from getMe:', userData);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status in Header:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Listen for login success events
  useEffect(() => {
    const handleLoginSuccess = () => {
      console.log('Login success event detected, refreshing user data...');
      refreshUserData();
    };

    // Listen for custom login success event
    window.addEventListener('loginSuccess', handleLoginSuccess);
    
    // Also listen for storage changes (if token is stored)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('Storage change detected, refreshing user data...');
        refreshUserData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    // Close modals IMMEDIATELY before anything else
    setShowTopup(false);
    setMenuOpen(false);
    
    setLoading(true);
    try {
      await logout();
      
      // Clear user data after successful logout
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout in Header:', error);
      // Clear user data even if logout API fails
      setUser(null);
      setIsAuthenticated(false);
      alert('Đăng xuất thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Consume RecipeContext
  const { isRecipeAuthor, handleEditRecipe, handleDeleteRecipe } = useContext(RecipeContext);

  // Check if current page is a recipe detail page
  const isRecipeDetailPage = location.pathname.startsWith('/detail-recipe/') && location.pathname.split('/').length === 3;

  // Function to check for new notifications and transactions
  const checkNewItems = async () => {
    if (!user?._id) return;
    
    try {
      // Check for new notifications
      const notificationsRes = await axios.get(`https://exe-web-cooking.onrender.com/api/notifications/unread`, {
        withCredentials: true
      });
      setHasNewNotifications(notificationsRes.data.length > 0);

      // Check for new transactions
      const transactionsRes = await axios.get(`https://exe-web-cooking.onrender.com/api/transactions/recent`, {
        withCredentials: true
      });
      setHasNewTransactions(transactionsRes.data.some(t => !t.isRead));
    } catch (error) {
      console.error('Error checking new items:', error);
    }
  };

  // Check for new items periodically
  useEffect(() => {
    if (isAuthenticated) {
      checkNewItems();
      const interval = setInterval(checkNewItems, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?._id]);

  if (loading) {
    return <header className="header">Đang tải header...</header>;
  }

  return (
    <header className="header">
      {/* Debug user data before rendering modal */}
      {user && user._id && showTopup && (
        <>
          {console.log('Rendering TopupModal with user:', user)}
          <TopupModal 
            open={showTopup} 
            onClose={() => setShowTopup(false)} 
            currentUser={user} 
          />
        </>
      )}
      
      <div className="header__container">
        <div className="header__logo" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>FitMeal</div>

        <nav className="header__nav">
          <a href="/">Trang chủ</a>
          <a href="/recipes">Công thức</a>
          <a href="/blog">Bài viết</a>
          <a href="/menu-suggestion">Gợi ý menu</a>
          <div className="header__dropdown">
            <span className="header__dropdown-toggle" tabIndex={0}>
              Công cụ tính các chỉ số
            </span>
            <div className="header__dropdown-menu">
              <a href="/tools/bmi">Công cụ tính BMI</a>
              <a href="/tools/weight">Công cụ tính cân nặng chuẩn</a>
              <a href="/tools/bmr-tdee">Công cụ tính BMR và TDEE</a>
            </div>
          </div>
          <a href="/about">Giới thiệu </a>
        </nav>
        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <div className="header__avatar" onClick={() => setMenuOpen(!menuOpen)} style={{cursor: 'pointer'}}>
                {user?.avatar
                  ? <img src={user.avatar} alt="avatar" />
                  : (user?.username ? user.username[0].toUpperCase() : 'U')}
                {hasNewNotifications && (
                  <span className="notification-badge" style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-bell"></i>
                  </span>
                )}
              </div>
              {menuOpen && isAuthenticated && (
                <div className="header__user-menu" ref={menuRef}>
                  {console.log('Rendering dropdown. Current user state:', user)}
                  {console.log('ảnh cua user :', user.avatar)}
                  <div className="header__user-info">
                    <div className="header__avatar">
                      {user?.avatar
                        ? <img src={user.avatar} alt="avatar" />
                        : (user?.username ? user.username[0].toUpperCase() : 'U')}
                    </div>
                    <div>
                      <div className="header__user-name">{user?.fullName || user?.username || 'username'}</div>
                      <div className="header__user-username">{user ? `@${user.username}` : ''}</div>
                    </div>
                  </div>
                  {user?._id && (
                    <div
                      className="header__user-menu-item"
                      onClick={() => {
                        setMenuOpen(false);
                        console.log("user id", user._id)
                        navigate(`/profile/${user._id}`);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-user"></i> Bếp cá nhân
                    </div>
                  )}
                  <div
                    className="header__user-menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/withdrawal');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-wallet"></i> Rút tiền
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
                      navigate('/settings/change-password');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-lock"></i> Thay đổi mật khẩu
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
                  <div
                    className="header__user-menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/notifications');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-bell"></i> Thông báo
                    {hasNewNotifications && (
                      <span style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '8px'
                      }}>!</span>
                    )}
                  </div>
                  <div
                    className="header__user-menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/wallet/history');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="fas fa-exchange-alt"></i> Giao dịch
                    {hasNewTransactions && (
                      <span style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '8px'
                      }}>!</span>
                    )}
                  </div>
                  <div className="header__user-menu-divider"></div>
                  <div className="header__user-menu-item header__user-menu-logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Thoát</div>
                </div>
              )}
              <button className="header__new-recipe-btn" onClick={() => navigate('/recipes/create')}>
                <i className="fas fa-pen"></i> Viết món mới
              </button>
              <button className="header__new-recipe-btn" onClick={() => navigate('/paymentQR')}>
                
                <i className="fas fa-wallet"></i> Nộp tiền QR code
              </button>

              {/* <button
                className="header__topup-btn"
                style={{ marginLeft: 10, background: '#ffe082', color: '#222', border: 'none', borderRadius: 18, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.18s' }}
                onClick={async () => {
                  // Refresh user data before opening modal to ensure latest data
                  await refreshUserData();
                  setShowTopup(true);
                }}
              >
                <i className="fas fa-wallet" style={{ marginRight: 6 }}></i> Nạp tiền
              </button> */}

              {/* Conditionally render Edit and Delete buttons for recipe author on detail page */}
           
            </>
          ) : (
            <button
              className="header__login-btn"
              onClick={() => navigate('/login')}
              style={{
                border: 'none',
                borderRadius: '22px',
                background: '#e6f7ea',
                color: '#218838',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '10px 28px',
                marginLeft: 12,
                boxShadow: '0 2px 8px #2e7d3211',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#3DD056';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.boxShadow = '0 4px 16px #2e7d3222';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#e6f7ea';
                e.currentTarget.style.color = '#218838';
                e.currentTarget.style.boxShadow = '0 2px 8px #2e7d3211';
              }}
            >
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;