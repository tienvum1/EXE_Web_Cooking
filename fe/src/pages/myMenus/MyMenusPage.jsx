import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyMenusPage.scss';

import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
 import Footer from '../../components/footer/Footer';

const MyMenusPage = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await axios.get('https://exe-web-cooking.onrender.com/api/menus/getMenus',{
                withCredentials: true  
            });
            setMenus(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menus:', error);
            toast.error('Lỗi khi tải danh sách thực đơn');
            setLoading(false);
        }
    };

    const handleMenuClick = (menuId) => {
        navigate(`/menu/${menuId}`);
    };

    const handleCreateMenu = () => {
        navigate('/menu-suggestion');
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <>
        <Header />
        <Sidebar/>
        <div className="my-menus-page">
            <h1 className="page-title">Thực Đơn Của Tôi</h1>

            {menus.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa có thực đơn nào</p>
                    <button className="create-menu-btn" onClick={handleCreateMenu}>
                        <i className="fas fa-plus"></i>
                        Tạo Thực Đơn Mới
                    </button>
                </div>
            ) : (
                <div className="menus-grid">
                    {menus.map((menu) => (
                        <div
                            key={menu._id}
                            className="menu-card"
                            onClick={() => handleMenuClick(menu._id)}
                        >
                            <div className="menu-header">
                                <h2 className="menu-name">{menu.name}</h2>
                                <p className="menu-date">
                                    {new Date(menu.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <Footer />
        </>
    );
};

export default MyMenusPage;