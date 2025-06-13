import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribePremium, checkPremiumStatus } from '../../api/premium';
import { toast } from 'react-toastify';
import './PremiumPackages.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';

const PREMIUM_PRICE = 25000; // Giá cố định của gói premium

const PremiumPackages = () => {
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra trạng thái premium
    useEffect(() => {
        const checkPremium = async () => {
            try {
                const response = await checkPremiumStatus();
                setIsPremium(response.data.isPremium);
            } catch (error) {
                toast.error('Không thể tải thông tin gói premium');
                console.error('Error checking premium status:', error);
            } finally {
                setLoading(false);
            }
        };
        checkPremium();
    }, []);

    // Ngăn cuộn trang khi modal mở
    useEffect(() => {
        if (showConfirmModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showConfirmModal]);

    // Xử lý khi nhấn nút đăng ký
    const handleSubscribeClick = () => {
        if (isPremium) {
            toast.info('Bạn đã là thành viên Premium');
            return;
        }
        setShowConfirmModal(true);
    };

    // Xử lý xác nhận đăng ký
    const handleConfirmSubscribe = async () => {
        try {
            setProcessing(true);
            setShowConfirmModal(false);
            
            const response = await subscribePremium();
            
            if (response.data.success) {
                toast.success('Đăng ký gói premium thành công!');
                setIsPremium(true);
                navigate('/profile');
            } else {
                handleSubscriptionError(response.data.message);
            }
        } catch (error) {
            handleSubscriptionError(error.response?.data?.message);
        } finally {
            setProcessing(false);
        }
    };

    // Xử lý lỗi đăng ký
    const handleSubscriptionError = (errorMessage) => {
        if (errorMessage?.toLowerCase().includes('insufficient')) {
            toast.error('Số dư ví không đủ để đăng ký gói premium. Vui lòng nạp thêm tiền vào ví.');
        } else if (errorMessage?.toLowerCase().includes('already premium')) {
            toast.info('Bạn đã là thành viên Premium');
            setIsPremium(true);
        } else {
            toast.error(errorMessage || 'Lỗi khi đăng ký gói premium');
        }
    };

    // Xử lý hủy đăng ký
    const handleCancelSubscribe = () => {
        setShowConfirmModal(false);
    };

    // Danh sách tính năng premium
    const premiumFeatures = [
        {
            icon: '🔍',
            title: 'Bộ lọc nâng cao',
            description: 'Tìm kiếm công thức với nhiều tiêu chí hơn như thời gian nấu, calories, nguyên liệu...'
        },
        {
            icon: '📋',
            title: 'Gợi ý menu',
            description: 'Nhận gợi ý menu hàng tuần phù hợp với sở thích và nhu cầu của bạn'
        },
        {
            icon: '💾',
            title: 'Lưu không giới hạn',
            description: 'Lưu trữ công thức yêu thích không giới hạn (Gói thường chỉ được lưu 5 món)'
        },
        {
            icon: '📱',
            title: 'Tải công thức offline',
            description: 'Tải công thức về để xem offline, không cần kết nối internet'
        },
        {
            icon: '⭐',
            title: 'Ưu tiên hỗ trợ',
            description: 'Được ưu tiên hỗ trợ và giải đáp thắc mắc từ đội ngũ chuyên gia'
        }
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <div className="premium-packages">
                <div className="premium-header">
                    <h1>Nâng cấp tài khoản Premium</h1>
                    <p>Mở khóa tất cả tính năng đặc biệt với gói premium</p>
                </div>

                {isPremium && (
                    <div className="premium-badge">
                        <span>Bạn đang sử dụng tài khoản Premium</span>
                    </div>
                )}

                <div className="premium-content">
                    <div className="premium-features">
                        <h2>Tính năng Premium</h2>
                        <div className="features-grid">
                            {premiumFeatures.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="premium-pricing">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h2>Gói Premium</h2>
                                <div className="price">
                                    <span className="amount">{PREMIUM_PRICE.toLocaleString('vi-VN')}₫</span>
                                    <span className="period">/tháng</span>
                                </div>
                            </div>

                            <div className="pricing-description">
                                <p>Phí đăng ký {PREMIUM_PRICE.toLocaleString('vi-VN')}₫/tháng. Mỗi tháng bạn có thể đăng ký tiếp nếu có nhu cầu sử dụng. Bạn có thể huỷ bất kỳ lúc nào trong phần Cài Đặt.</p>
                            </div>

                            <div className="pricing-features">
                                <ul>
                                    {premiumFeatures.map((feature, index) => (
                                        <li key={index}>
                                            <i className="fas fa-check"></i>
                                            {feature.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className={`subscribe-button ${isPremium ? 'disabled' : ''} ${processing ? 'processing' : ''}`}
                                onClick={handleSubscribeClick}
                                disabled={isPremium || processing}
                            >
                                {processing ? 'Đang xử lý...' : isPremium ? 'Đã đăng ký' : 'Đăng ký ngay'}
                            </button>
                        </div>
                    </div>
                </div>

                {showConfirmModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Xác nhận đăng ký gói Premium   </h3>
                                <button className="close-button" onClick={handleCancelSubscribe} aria-label="Đóng">×</button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn đăng ký gói Premium với giá {PREMIUM_PRICE.toLocaleString('vi-VN')}₫/tháng?</p>
                            </div>
                            <div className="modal-buttons">
                                <button 
                                    className="confirm-button"
                                    onClick={handleConfirmSubscribe}
                                    disabled={processing}
                                >
                                    {processing ? 'Đang xử lý...' : 'Có, đăng ký ngay'}
                                </button>
                                <button 
                                    className="cancel-button"
                                    onClick={handleCancelSubscribe}
                                    disabled={processing}
                                >
                                    Không, hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default PremiumPackages;