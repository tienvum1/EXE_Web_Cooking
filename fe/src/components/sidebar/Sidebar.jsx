import React, { useState } from 'react';
import './Sidebar.scss';
import { FaSearch, FaUser, FaBell, FaGlobe, FaCheck, FaRegBookmark, FaChartBar, FaCrown, FaBook, FaLock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

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
          <div className="sidebar__item active">
            <FaSearch className="sidebar__icon" />
            <span>Tìm kiếm</span>
          </div>
          <div className="sidebar__item">
            <FaCrown className="sidebar__icon" />
            <span>Premium</span>
          </div>
          <div className="sidebar__item">
            <FaChartBar className="sidebar__icon" />
            <span>Thống Kê Bếp</span>
          </div>
          <div className="sidebar__item">
            <FaRegBookmark className="sidebar__icon" />
            <span>Thử Thách</span>
          </div>
          <div className="sidebar__item">
            <FaBell className="sidebar__icon" />
            <span>Tương Tác</span>
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
          <div className="sidebar__subitem">
            <FaRegBookmark className="sidebar__icon" />
            <span>Đã Lưu</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem">
            <FaCheck className="sidebar__icon" />
            <span>Đã Nấu</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem">
            <FaUser className="sidebar__icon" />
            <span>Món Của Tôi</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem">
            <FaGlobe className="sidebar__icon" />
            <span>Đã lên sóng</span>
            <span className="sidebar__count">0 món</span>
          </div>
          <div className="sidebar__subitem">
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