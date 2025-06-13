import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../api/auth';
import { createTopupTransaction } from '../../api/transaction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MBQRCode.scss';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import { FaOtter } from 'react-icons/fa';

const MBQRCode = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [userBankInfo, setUserBankInfo] = useState({
        bankName: '',
        accountHolderName: ''
    });

    // Thông tin tài khoản ngân hàng
    const accountInfo = {
        bankName: 'MB Bank',
        accountName: 'PHAM LE TIEN VU',
        accountNumber: '29689999999',
        bankCode: 'MB'
    };

    // Lấy thông tin người dùng đang đăng nhập
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userData = await getMe();
                setUserInfo(userData);
            } catch (error) {
                console.error('Error fetching user info:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    // Tạo URL cho mã QR VietQR
    useEffect(() => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ');
            setQrUrl('');
            return;
        }

        if (!userInfo) return;

        setError('');
        const amountInVND = Math.round(parseFloat(amount));
        const content = userInfo._id;

        // Tạo URL cho VietQR API
        const qrUrl = `https://img.vietqr.io/image/${accountInfo.bankCode}-${accountInfo.accountNumber}-print.png?accountName=${encodeURIComponent(accountInfo.accountName)}&amount=${amountInVND}&addInfo=${encodeURIComponent(content)}`;
        setQrUrl(qrUrl);
    }, [amount, userInfo]);

    const handleBankInfoChange = (e) => {
        const { name, value } = e.target;
        setUserBankInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateBankInfo = () => {
        if (!userBankInfo.bankName.trim()) {
            setError('Vui lòng nhập tên ngân hàng');
            return false;
        }
        if (!userBankInfo.accountHolderName.trim()) {
            setError('Vui lòng nhập tên chủ tài khoản');
            return false;
        }
        return true;
    };

    const handleConfirmPayment = async () => {
        try {
            if (!validateBankInfo()) return;

            setConfirmLoading(true);
            const response = await createTopupTransaction(
                parseInt(amount), 
                userInfo._id,
                userBankInfo
            );
            
            if (response.success) {
                setIsConfirmed(true);
                toast.success('Yêu cầu nạp tiền đã được gửi thành công!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => {
                    navigate('/wallet');
                }, 3000);
            } else {
                toast.error('Có lỗi xảy ra khi tạo yêu cầu nạp tiền', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo yêu cầu nạp tiền', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error('Error creating transaction:', error);
        } finally {
            setConfirmLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-qr-container">
                <div className="loading">Đang tải thông tin...</div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="mb-qr-container">
                <div className="error-message">Vui lòng đăng nhập để sử dụng tính năng này</div>
            </div>
        );
    }

    return (
        <>
        <Header/>
        <Sidebar/>
        <div className="mb-qr-container">
            <ToastContainer />
            <div className="payment-instructions">
                <h2>Nạp tiền vào ví</h2>
                <div className="steps">
                    <div className="step">
                        <p>Nhập chính xác số tiền bạn muốn nạp vào ví</p>
                    </div>
                    <div className="step">
                        <p>Nhập thông tin tài khoản ngân hàng mà bạn dùng để chuyển</p>
                    </div>
                    <div className="step">
                        <p>Quét mã QR bằng ứng dụng ngân hàng của bạn</p>
                    </div>
                    <div className="step">
                        <p>Kiểm tra thông tin chuyển khoản và xác nhận</p>
                    </div>
                </div>
            </div>

            <div className="qr-section">
                <div className="amount-input">
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Nhập số tiền (VNĐ)"
                        min="0"
                    />
                </div>

                <div className="bank-info-input">
                    <h3>Thông tin tài khoản của bạn</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            name="bankName"
                            value={userBankInfo.bankName}
                            onChange={handleBankInfoChange}
                            placeholder="Tên ngân hàng"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="accountHolderName"
                            value={userBankInfo.accountHolderName}
                            onChange={handleBankInfoChange}
                            placeholder="Tên chủ tài khoản"
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                {qrUrl && !error && (
                    <div className="qr-code">
                        <img src={qrUrl} alt="Mã QR chuyển khoản" />
                        <div className="transfer-info">
                            <div className="info-row">
                                <span className="label">Ngân hàng:</span>
                                <span className="value">{accountInfo.bankName}</span>
                            </div>
                        
                            <div className="info-row">
                                <span className="label">Chủ tài khoản:</span>
                                <span className="value">{accountInfo.accountName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Số tiền:</span>
                                <span className="value">{parseInt(amount).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Nội dung:</span>
                                <span className="value">{userInfo._id}</span>
                            </div>
                        </div>
                        <button 
                            className={`confirm-button ${isConfirmed ? 'confirmed' : ''}`}
                            onClick={handleConfirmPayment}
                            disabled={isConfirmed || confirmLoading}
                        >
                            {confirmLoading ? 'Đang xử lý...' : 
                             isConfirmed ? 'Đã xác nhận ✓' : 
                             'Xác nhận đã chuyển khoản'}
                        </button>
                    </div>
                )}
            </div>
        </div>
        <Footer />
        </>
    );
};

export default MBQRCode; 