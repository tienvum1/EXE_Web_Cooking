const User = require('../models/User');

exports.requirePremium = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.user_id);

        // Kiểm tra xem gói premium của người dùng có hết hạn chưa
        if (user && user.isPremium && user.endDate < new Date()) {
            user.isPremium = false;
            await user.save();
            console.log(`User ${user._id} premium status updated to false due to expiration.`);
        }

        // Nếu người dùng không phải là premium hoặc không tồn tại (sau khi kiểm tra hết hạn)
        if (!user || !user.isPremium) {
            return res.status(403).json({
                success: false,
                message: 'Tính năng này yêu cầu tài khoản premium. Vui lòng đăng ký gói Premium để sử dụng.'
            });
        }

        next();
    } catch (error) {
        console.error('Lỗi trong middleware requirePremium:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi kiểm tra trạng thái premium',
            error: error.message
        });
    }
}; 