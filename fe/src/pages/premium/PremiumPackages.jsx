import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { subscribePremium, checkPremiumStatus } from '../../api/premium';
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
    const [premiumEndDate, setPremiumEndDate] = useState(null); // New state for end date
    const navigate = useNavigate();

    // Kiểm tra trạng thái premium
    useEffect(() => {
        const checkPremium = async () => {
            try {
                const response = await checkPremiumStatus();
                if (response.data) { // Ensure response.data exists
                    setIsPremium(response.data.isPremium); // Assuming isPremium is directly in response.data
                    if (response.data.isPremium && response.data.subscription?.endDate) {
                        setPremiumEndDate(new Date(response.data.subscription.endDate));
                    }
                }
            } catch (error) {
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
            return;
        }
        setShowConfirmModal(true);
    };

    // Xử lý xác nhận đăng ký
    const handleConfirmSubscribe = async () => {
        try {
            setProcessing(true);
            setShowConfirmModal(false);
            
            console.log('Attempting to subscribe to premium...');
            const response = await subscribePremium({
                amount: PREMIUM_PRICE,
                type: 'register_premium',
                transferContent: 'register_premium'
            });
            
            console.log('API response from subscribe:', response);
            console.log('response.data.success from subscribe:', response.success);

            if (response.success == true) {
                console.log('Entering success block...');
                window.alert('Đăng ký gói Premium thành công!');
                setIsPremium(true);
                setPremiumEndDate(new Date(response.data.data.subscription.endDate)); // Update end date on successful subscription
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            } else {
                console.log('Entering error block (response.data.success is false) from subscribe...');
                handleSubscriptionError(response.data);
            }
        } catch (error) {
            console.log('Entering catch block from subscribe...');
            console.log('Error response from subscribe:', error.response);
            handleSubscriptionError(error.response?.data || { message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' });
        } finally {
            setProcessing(false);
        }
    };

    // Xử lý lỗi đăng ký
    const handleSubscriptionError = (errorData) => {
        console.log('handleSubscriptionError called with:', errorData);
        const { message, type, data } = errorData || {};

        console.log('Error message from API:', message);
        console.log('Error type from API:', type);
        console.log('Error data from API:', data);

        if (!message) {
            return;
        }

        if (message.toLowerCase().includes('số dư ví không đủ') || message.toLowerCase().includes('số dư không đủ')) {
        } else if (message.toLowerCase().includes('đã là thành viên premium')) {
            setIsPremium(true);
            if (data?.endDate) {
                setPremiumEndDate(new Date(data.endDate));
            }
        }
    };

    // Xử lý hủy đăng ký
    const handleCancelSubscribe = () => {
        setShowConfirmModal(false);
    };

    // Danh sách tính năng premium
    const premiumFeatures = [
        {
            icon: '✅',
            title: 'Gợi ý thực đơn nâng cao',
            description: 'Nhận các gợi ý thực đơn được cá nhân hóa và đa dạng hơn.'
        },
        {
            icon: '💾',
            title: 'Lưu công thức không giới hạn',
            description: 'Lưu trữ công thức yêu thích không giới hạn (Gói thường chỉ được lưu 5 món).',
        },
        {
            icon: '🛡️',
            title: 'Hỗ trợ ưu tiên',
            description: 'Nhận được sự hỗ trợ nhanh chóng và ưu tiên từ đội ngũ của chúng tôi.'
        },
        {
            icon: '🔓',
            title: 'Truy cập không giới hạn',
            description: 'Truy cập tất cả các công thức nấu ăn và tính năng mà không có giới hạn.'
        },
        {
            icon: '🚫',
            title: 'Trải nghiệm không quảng cáo',
            description: 'Tận hưởng ứng dụng mà không bị gián đoạn bởi quảng cáo.'
        },
        {
            icon: '💰',
            title: 'Ưu đãi đặc biệt',
            description: 'Nhận các ưu đãi và khuyến mãi độc quyền chỉ dành cho thành viên Premium.'
        }
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <p>Đang tải...</p>
            </div>
        );
    }

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
                        <span>Bạn đang sử dụng tài khoản Premium </span>
                        {premiumEndDate && (
                            <span className="end-date">
                                (Hết hạn: {premiumEndDate.toLocaleDateString('vi-VN')})
                            </span>
                        )}
                    </div>
                )}

                <div className="premium-content">
                    <div className="premium-features">
                        <h2>Tính năng Premium</h2>
                        <div className="features-grid">
                            {premiumFeatures.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <h3 className="feature-title">{feature.icon} {feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
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
                                            <i className="fas fa-check"></i> {feature.title}
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
                    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 id="modal-title">Xác nhận đăng ký gói Premium</h3>
                                <button className="close-button" onClick={handleCancelSubscribe} aria-label="Đóng">×</button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn đăng ký gói Premium với giá {PREMIUM_PRICE.toLocaleString('vi-VN')}₫ không?</p>
                                <p>Gói này sẽ có hiệu lực trong 30 ngày.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="cancel-button" onClick={handleCancelSubscribe} disabled={processing}>Hủy</button>
                                <button className="confirm-button" onClick={handleConfirmSubscribe} disabled={processing}>
                                    {processing ? 'Đang xác nhận...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default PremiumPackages;