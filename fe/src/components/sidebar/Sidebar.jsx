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
  const [savedRecipesCount, setSavedRecipesCount] = useState(0);
  const [allRecipesCount, setAllRecipesCount] = useState(0);
  const [publishedRecipesCount, setPublishedRecipesCount] = useState(0);
  const [draftRecipesCount, setDraftRecipesCount] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getWalletBalance();
      setBalance(balance);
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchSavedCount = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/saved-recipes/list`, { withCredentials: true });
        setSavedRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch saved recipes count:", err);
        setSavedRecipesCount(0);
      }
    };
    fetchSavedCount();
  }, []);

  useEffect(() => {
    const fetchAllRecipesCount = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes/me/all-recipes`, { withCredentials: true });
        setAllRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch all recipes count:", err);
        setAllRecipesCount(0);
      }
    };
    fetchAllRecipesCount();
  }, []);

  useEffect(() => {
    const fetchPublishedCount = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me/published-recipes`, { withCredentials: true });
        setPublishedRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch published recipes count:", err);
        setPublishedRecipesCount(0);
      }
    };
    fetchPublishedCount();
  }, []);

  useEffect(() => {
    const fetchDraftCount = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me/draft-recipes`, { withCredentials: true });
        setDraftRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch draft recipes count:", err);
        setDraftRecipesCount(0);
      }
    };
    fetchDraftCount();
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
          <div className="sidebar__subitem" onClick={()=> navigate('/all-recipes')}>
            <FaBook className="sidebar__icon" />
            <span>Tất Cả</span>
            <span className="sidebar__count">{allRecipesCount} món</span>
          </div>
          <div className="sidebar__subitem" onClick={()=> navigate('/recipes-saved')}>
            <FaRegBookmark className="sidebar__icon" />
            <span>Đã Lưu</span>
            <span className="sidebar__count">{savedRecipesCount} món</span>
          </div>
          <div className="sidebar__subitem" onClick={()=> navigate('/published-recipes')}>
            <FaGlobe className="sidebar__icon" />
            <span>Đã lên sóng</span>
            <span className="sidebar__count">{publishedRecipesCount} món</span>
          </div>
          <div className="sidebar__subitem" onClick={()=> navigate('/draft-recipes')}>
            <FaLock className="sidebar__icon" />
            <span>Món Nháp</span>
            <span className="sidebar__count">{draftRecipesCount} món</span>
          </div>
        </div>
      </div>
      {open && <div className="sidebar__overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;