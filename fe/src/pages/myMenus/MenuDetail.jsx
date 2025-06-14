import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import './MenuDetail.scss';

const MenuDetail = () => {
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const { menuId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMenuDetails();
    }, [menuId]);

    const fetchMenuDetails = async () => {
        try {
            const response = await axios.get(`https://exe-web-cooking.onrender.com/api/menus/${menuId}`, {
                withCredentials: true
            });
            setMenu(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu details:', error);
            toast.error('Lỗi khi tải chi tiết thực đơn');
            setLoading(false);
        }
    };

    const handleDeleteMenu = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thực đơn này?')) {
            try {
                await axios.delete(`https://exe-web-cooking.onrender.com/api/menus/${menuId}`, {
                    withCredentials: true
                });
                toast.success('Xóa thực đơn thành công');
                navigate('/my-menus');
            } catch (error) {
                console.error('Error deleting menu:', error);
                toast.error('Lỗi khi xóa thực đơn');
            }
        }
    };

    const handleBack = () => {
        navigate('/my-menus');
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (!menu) {
        return <div className="error">Không tìm thấy thực đơn</div>;
    }

    return (
        <>
            <Header />
            <Sidebar />
            <div className="menu-detail-page">
                <div className="detail-header">
                    <button className="back-btn" onClick={handleBack}>
                        <i className="fas fa-arrow-left"></i>
                        Quay lại
                    </button>
                    <h1>{menu.menu.name}</h1>
                    <button className="delete-btn" onClick={handleDeleteMenu}>
                        <i className="fas fa-trash"></i>
                        Xóa
                    </button>
                </div>

                <div className="total-nutrition-summary">
                    <h2>Tổng Dinh Dưỡng</h2>
                    <div className="nutrition-grid">
                        <div className="nutrition-item">
                            <span className="label">Calo</span>
                            <span className="value">{menu.totalNutrition.calories}</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="label">Đạm</span>
                            <span className="value">{menu.totalNutrition.protein}g</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="label">Tinh bột</span>
                            <span className="value">{menu.totalNutrition.carbs}g</span>
                        </div>
                        <div className="nutrition-item">
                            <span className="label">Chất béo</span>
                            <span className="value">{menu.totalNutrition.fat}g</span>
                        </div>
                    </div>
                </div>

                <div className="meals-container">
                    {menu.menu.meals.map((meal, index) => (
                        <div key={index} className="meal-section">
                            <h3 className="meal-title">
                                {meal.mealType === 'breakfast' ? 'Bữa Sáng' :
                                 meal.mealType === 'lunch' ? 'Bữa Trưa' : 'Bữa Tối'}
                            </h3>
                            
                            <div className="meal-nutrition">
                                <div className="nutrition-item">
                                    <span className="label">Calo</span>
                                    <span className="value">{meal.nutrition.calories}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">Đạm</span>
                                    <span className="value">{meal.nutrition.protein}g</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">Tinh bột</span>
                                    <span className="value">{meal.nutrition.carbs}g</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="label">Chất béo</span>
                                    <span className="value">{meal.nutrition.fat}g</span>
                                </div>
                            </div>

                            <div className="recipes-grid">
                                {meal.recipes.map((recipe) => (
                                    <RecipeCard
                                        key={recipe._id}
                                        id={recipe._id}
                                        mainImage={recipe.mainImage}
                                        title={recipe.title}
                                        time={recipe.cookTime}
                                        author={recipe.author?.fullName || ' '}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MenuDetail; 