import React, { useState } from 'react';
import './Sidebar.scss';
import { FaSearch, FaUser, FaBell, FaGlobe, FaCheck, FaRegBookmark, FaChartBar, FaCrown, FaBook, FaLock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const getWalletBalance = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/payment/balance`,
    { withCredentials: true }
  );
  return res.data.balance;
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getWalletBalance();
      setBalance(balance);
    };
    fetchBalance();
  }, []);

  return (
    <>
      <button className="sidebar__toggle-btn" onClick={() => setOpen(!open)}>
        {open ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      <div className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar__header">
          <img src={logo} alt="FitMeal" className="sidebar__logo" />
        </div>
        <div className="sidebar__menu">
          <div className="sidebar__item">
            <FaCrown className="sidebar__icon" />
            <span>Premium</span>
          </div>
          <div className="sidebar__item">
            <FaChartBar className="sidebar__icon" />
            <span>Số dư: {balance}đ</span>
          </div>
          <div className="sidebar__item">
            <FaRegBookmark className="sidebar__icon" />
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/wallet/history')}>Lịch sử giao dịch</span>
          </div>
          <div className="sidebar__item">
            <FaBell className="sidebar__icon" />
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/notifications')}>Thông báo</span>
          </div>
          <div className="sidebar__item sidebar__section">
            <FaBook className="sidebar__icon" />
            <span>Kho Món Ngon Của Bạn</span>
          </div>
          <div className="sidebar__searchbox">
            <FaSearch className="sidebar__icon" />
            <input placeholder="Tìm trong kho món ngon" />
          </div>
          <div className="sidebar__subitem">
            <FaBook className="sidebar__icon" />
            <span>Tất Cả</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem" onClick={()=> navigate('/recipes-saved')}>
            <FaRegBookmark className="sidebar__icon" />
            <span>Đã Lưu</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem" onClick={()=> navigate('/recipes-published')}>
            <FaGlobe className="sidebar__icon" />
            <span>Đã lên sóng</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem" onClick={()=> navigate('/recipes-draft')}>
            <FaLock className="sidebar__icon" />
            <span>Món Nháp</span>
            <span className="sidebar__count">0 món</span>
          </div>
        </div>
      </div>
      {open && <div className="sidebar__overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;