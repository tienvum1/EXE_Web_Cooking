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
  const [pendingRecipesCount, setPendingRecipesCount] = useState(0);

  // Assume `isAuthenticated` is a boolean value indicating user's authentication status
  // You need to replace `isAuthenticated` with the actual way you track authentication status
  const isAuthenticated = true; // Placeholder: Replace with your actual auth check

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await getWalletBalance();
        setBalance(balance);
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err);
        setBalance(0); // Set balance to 0 or handle error appropriately
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchBalance();
    }
    // Add dependency that tracks authentication status here, e.g., [isAuthenticated]
  }, [/* add authentication dependency here */]);

  useEffect(() => {
    const fetchSavedCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/saved-recipes/list`, { withCredentials: true });
        setSavedRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch saved recipes count:", err);
        setSavedRecipesCount(0);
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchSavedCount();
    }
    // Add dependency that tracks authentication status here
  }, [/* add authentication dependency here */]);

  useEffect(() => {
    const fetchAllRecipesCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/me/all-recipes`, { withCredentials: true });
        setAllRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch all recipes count:", err);
        setAllRecipesCount(0);
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchAllRecipesCount();
    }
    // Add dependency that tracks authentication status here
  }, [/* add authentication dependency here */]);

  useEffect(() => {
    const fetchPublishedCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/me/published-recipes`, { withCredentials: true });
        setPublishedRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch published recipes count:", err);
        setPublishedRecipesCount(0);
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchPublishedCount();
    }
    // Add dependency that tracks authentication status here
  }, [/* add authentication dependency here */]);

  useEffect(() => {
    const fetchDraftCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/me/draft-recipes`, { withCredentials: true });
        setDraftRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch draft recipes count:", err);
        setDraftRecipesCount(0);
      }
    };

    // Only fetch if authenticated
    if (isAuthenticated) {
      fetchDraftCount();
    }
    // Add dependency that tracks authentication status here
  }, [/* add authentication dependency here */]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/me/pendings`, { withCredentials: true });
        setPendingRecipesCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch pending recipes count:", err);
        setPendingRecipesCount(0);
      }
    };

    if (isAuthenticated) {
      fetchPendingCount();
    }
  }, [/* add authentication dependency here */]);

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
            <span onClick={() => navigate('/premium ')}>Premium</span>
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
          <div className="sidebar__item">
            <FaBell className="sidebar__icon" />
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/my-menus')}>Thực đơn của bạn</span>
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
          <div className="sidebar__subitem" onClick={()=> navigate('/pending-recipes')}>
            <FaCheck className="sidebar__icon" />
            <span>Đang chờ duyệt</span>
            <span className="sidebar__count">{pendingRecipesCount} món</span>
          </div>
        </div>
      </div>
      {open && <div className="sidebar__overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;