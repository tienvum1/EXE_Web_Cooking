const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const nodemailer = require("nodemailer");

// Lấy lịch sử giao dịch của user
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const transactions = await Transaction.find({
      $or: [
        { to: userId },
        { from: userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử giao dịch', error: err.message });
  }
};
// Tạo giao dịch nạp tiền mới
exports.createTopupTransaction = async (req, res) => {
    try {
        const { amount, transferContent, bankInfo } = req.body;
        console.log(req.body);
        const userId = req.user.user_id;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số tiền không hợp lệ'
            });
        }

        if (!bankInfo || !bankInfo.bankName || !bankInfo.accountHolderName) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin ngân hàng'
            });
        }

        // Tạo transaction mới
        const transaction = new Transaction({
            to: userId,
            amount: amount,
            type: 'topup',
            method: 'bank_transfer',
            status: 'pending',
            bankName: bankInfo.bankName,
            accountHolderName: bankInfo.accountHolderName,
            transferContent: transferContent
        });

        await transaction.save();

        // Lấy thông tin user để gửi email
        const user = await User.findById(userId);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
    
        // Gửi email thông báo cho admin
        await transporter.sendMail({
            to: 'vupltde170269@fpt.edu.vn',
            subject: 'Yêu cầu nạp tiền mới - FitMeal',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">Yêu cầu nạp tiền mới</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Người dùng:</strong> ${user.username}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${user.email}</p>
                        <p style="margin: 10px 0;"><strong>Số tiền:</strong> ${amount.toLocaleString('vi-VN')} VNĐ</p>
                        <p style="margin: 10px 0;"><strong>Nội dung CK:</strong> ${transferContent}</p>
                        <p style="margin: 10px 0;"><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                        <p style="margin: 10px 0;"><strong>Mã giao dịch:</strong> ${transaction._id}</p>
                        
                        <h3 style="color: #2c3e50; margin-top: 20px;">Thông tin tài khoản người dùng:</h3>
                        <p style="margin: 10px 0;"><strong>Ngân hàng:</strong> ${bankInfo.bankName}</p>
                        <p style="margin: 10px 0;"><strong>Chủ tài khoản:</strong> ${bankInfo.accountHolderName}</p>
                    </div>

                    <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <p style="margin: 0; color: #2e7d32;">
                            Vui lòng kiểm tra và xử lý yêu cầu này trong trang quản trị FitMeal.
                        </p>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                        <p>Email này được gửi tự động từ hệ thống FitMeal.</p>
                        <p>Vui lòng không trả lời email này.</p>
                    </div>
                </div>
            `
        });

        res.status(201).json({
            success: true,
            message: 'Yêu cầu nạp tiền đã được gửi và đang chờ xác nhận',
            data: transaction
        });
    } catch (error) {
        console.error('Error in createTopupTransaction:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tạo yêu cầu nạp tiền',
            error: error.message
        });
    }
};
// Lấy danh sách các yêu cầu nạp tiền đang chờ xác nhận
exports.getPendingTopupRequests = async (req, res) => {
  try {
      const transactions = await Transaction.find({
          type: 'topup',
          status: 'pending'
      })
      .populate('to', 'username email')
      .sort({ createdAt: -1 });

      res.json({
          success: true,
          data: transactions
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi lấy danh sách yêu cầu',
          error: error.message
      });
  }
};

// Admin xác nhận hoặc từ chối yêu cầu nạp tiền
exports.handleTopupRequest = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { action } = req.body;

        if (!action) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp hành động (approve/reject)'
            });
        }

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Hành động không hợp lệ. Chỉ chấp nhận approve hoặc reject'
            });
        }

        const transaction = await Transaction.findById(transactionId)
            .populate('to', 'username email');
        
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy giao dịch'
            });
        }

        if (transaction.type !== 'topup') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch không phải là nạp tiền'
            });
        }

        if (transaction.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch không ở trạng thái chờ xử lý'
            });
        }

        if (action === 'approve') {
            try {
                // Cập nhật trạng thái transaction
                transaction.status = 'success';
                await transaction.save();

                // Tìm hoặc tạo wallet cho user
                let wallet = await Wallet.findOne({ user: transaction.to });
                
                if (!wallet) {
                    // Nếu chưa có wallet, tạo mới
                    wallet = await Wallet.create({
                        user: transaction.to,
                        balance: 0
                    });
                }

                // Cập nhật số dư
                wallet.balance += transaction.amount;
                wallet.updatedAt = new Date();
                await wallet.save();

                res.json({
                    success: true,
                    message: 'Đã xác nhận nạp tiền thành công',
                    data: {
                        transaction,
                        newBalance: wallet.balance
                    }
                });
            } catch (error) {
                // Nếu có lỗi trong quá trình xử lý, rollback transaction
                transaction.status = 'pending';
                await transaction.save();
                
                throw error;
            }
        } else {
            // Nếu từ chối, chỉ cập nhật trạng thái transaction
            transaction.status = 'rejected';
            await transaction.save();

            res.json({
                success: true,
                message: 'Đã từ chối yêu cầu nạp tiền',
                data: transaction
            });
        }
    } catch (error) {
        console.error('Error in handleTopupRequest:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

