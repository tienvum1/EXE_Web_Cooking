const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const mongoose = require('mongoose');

// Đăng ký gói premium
exports.subscribePremium = async (req, res) => {
    try {
        const { amount, type, transferContent } = req.body;
        console.log('Request body:', req.body);
        const userId = req.user.user_id;
        console.log('User ID:', userId);

        const user = await User.findById(userId);
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        const wallet = await Wallet.findOne({ user: userId });
        console.log('Wallet found:', wallet ? 'Yes' : 'No');
        console.log('Current wallet balance:', wallet?.balance);
        
        // Kiểm tra số dư ví
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Số dư ví không đủ để đăng ký gói premium',
                type: 'error',
                data: {
                    requiredAmount: amount,
                    currentBalance: wallet?.balance || 0
                }
            });
        }

        // Kiểm tra nếu người dùng đã là premium
        if (user.isPremium && user.endDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã là thành viên Premium và gói vẫn còn hiệu lực',
                type: 'info',
                data: {
                    endDate: user.endDate
                }
            });
        }

        // Tạo giao dịch với to là một ObjectId hợp lệ
        const systemId = new mongoose.Types.ObjectId();
        console.log('Creating transaction with system ID:', systemId);
        
        const transaction = await Transaction.create({
            from: userId,
            to: systemId,
            amount: amount,
            type: type,
            status: 'completed',
            transferContent: transferContent || `NAP PREMIUM ${userId}`
        });
        console.log('Transaction created:', transaction);

        // Cập nhật số dư ví
        wallet.balance -= amount;
        await wallet.save();
        console.log('New wallet balance:', wallet.balance);

        // Cập nhật thông tin premium của user
        user.isPremium = true;
        user.startDate = new Date();
        user.endDate = new Date();
        user.endDate.setMonth(user.endDate.getMonth() + 1);
        await user.save();
        console.log('User premium status updated:', {
            isPremium: user.isPremium,
            startDate: user.startDate,
            endDate: user.endDate
        });

        const response = {
            success: true,
            message: 'Đăng ký gói premium thành công',
            type: 'success',
            data: {
                transaction,
                subscription: {
                    isPremium: user.isPremium,
                    startDate: user.startDate,
                    endDate: user.endDate
                },
                newWalletBalance: wallet.balance
            }
        };
        console.log('Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('Lỗi khi đăng ký gói premium:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng ký gói premium',
            type: 'error',
            error: error.message
        });
    }
};


// Kiểm tra trạng thái premium
exports.checkPremiumStatus = async (req, res) => {
    try {
        const userId = req.user.user_id;
        console.log('checkPremiumStatus - User ID:', userId);

        const user = await User.findById(userId);
        console.log('checkPremiumStatus - User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('checkPremiumStatus - User not found, sending 404.');
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        // Kiểm tra xem subscription có hết hạn chưa
        if (user.isPremium && user.endDate < new Date()) {
            console.log('checkPremiumStatus - Premium expired, updating status.');
            user.isPremium = false;
            await user.save();
        }

        console.log('checkPremiumStatus - Preparing to send successful response.');
        console.log('checkPremiumStatus - Type of res:', typeof res);
        console.log('checkPremiumStatus - res object:', res); 

        // Original complex response
        return res.json({
            success: true,
            data: {
                isPremium: user.isPremium,
                subscription: {
                    startDate: user.startDate,
                    endDate: user.endDate
                }
            }
        });

    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái premium (catch block):', error);
        console.log('checkPremiumStatus - Entering catch block for sending error response.');
        
        if (res && typeof res.status === 'function' && typeof res.json === 'function') {
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi kiểm tra trạng thái premium',
                error: error.message
            });
        } else {
            console.error('checkPremiumStatus - Cannot send 500 error response: res object is invalid.', res);
        }
    }
};
