import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './MBQRCode.scss';

const MBQRCode = ({ userId }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    // Thông tin tài khoản ngân hàng
    const accountInfo = {
        bankName: 'MB Bank',
        accountName: 'PHAM LE TIEN VU',
        accountNumber: '0815618427',
        bankCode: 'MB'
    };

    // Tạo chuỗi dữ liệu cho mã QR theo định dạng VietQR
    const generateQRData = () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ');
            return null;
        }

        setError('');
        const amountInVND = Math.round(parseFloat(amount) * 1000); // Chuyển đổi sang xu
        const content = `ID${userId}`; // Nội dung chuyển khoản là ID của người dùng

        // Định dạng theo chuẩn VietQR
        return `https://api.vietqr.io/image/${accountInfo.bankCode}-${accountInfo.accountNumber}-${amountInVND}-${content}`;
    };

    return (
        <div className="mb-qr-container">
            <div className="account-info">
                <h3>Thông tin chuyển khoản</h3>
                <div className="info-item">
                    <span className="label">Ngân hàng:</span>
                    <span className="value">{accountInfo.bankName}</span>
                </div>
                <div className="info-item">
                    <span className="label">Chủ tài khoản:</span>
                    <span className="value">{accountInfo.accountName}</span>
                </div>
                <div className="info-item">
                    <span className="label">Số tài khoản:</span>
                    <span className="value">{accountInfo.accountNumber}</span>
                </div>
            </div>

            <div className="qr-section">
                <div className="amount-input">
                    <label htmlFor="amount">Nhập số tiền (VNĐ):</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Nhập số tiền"
                        min="0"
                    />
                    {error && <div className="error-message">{error}</div>}
                </div>

                {amount && !error && (
                    <div className="qr-code">
                        <QRCodeCanvas
                            value={generateQRData()}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                        <p className="qr-note">Quét mã QR để chuyển khoản</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MBQRCode; 