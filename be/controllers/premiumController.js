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
                message: 'Số dư ví không đủ để đăng ký gói premium'
            });
        }

        // Kiểm tra nếu người dùng đã là premium
        if (user.isPremium && user.endDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã là thành viên Premium và gói vẫn còn hiệu lực'
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
            message: 'Lỗi khi đăng ký gói premium'
        });
    }
};

// Lấy danh sách gói premium
exports.getPremiumPackages = async (req, res) => {
    try {
        res.json({
            success: true,
            data: [{
                name: 'Gói Premium',
                price: 25000,
                duration: 30,
                description: 'Mở khóa tất cả tính năng đặc biệt',
                features: ['Bộ lọc nâng cao', 'Gợi ý menu', 'Lưu không giới hạn', 'Tải công thức offline', 'Ưu tiên hỗ trợ']
            }]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách gói premium'
        });
    }
};

// Kiểm tra trạng thái premium
exports.checkPremiumStatus = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        // Kiểm tra xem subscription có hết hạn chưa
        if (user.isPremium && user.endDate < new Date()) {
            user.isPremium = false;
            await user.save();
        }

        res.json({
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
        console.error('Lỗi khi kiểm tra trạng thái premium:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra trạng thái premium'
        });
    }
};

// Hủy gói premium
exports.cancelPremium = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            });
        }

        if (!user.isPremium) {
            return res.status(400).json({
                success: false,
                message: 'Bạn chưa đăng ký gói premium'
            });
        }

        user.isPremium = false;
        await user.save();

        res.json({
            success: true,
            message: 'Hủy gói premium thành công'
        });
    } catch (error) {
        console.error('Lỗi khi hủy gói premium:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi hủy gói premium'
        });
    }
}; 