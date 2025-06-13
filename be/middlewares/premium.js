const User = require('../models/User');

exports.requirePremium = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        // Kiểm tra xem subscription có hết hạn chưa
        if (user.subscription.isPremium && user.subscription.endDate < new Date()) {
            user.subscription.isPremium = false;
            await user.save();
        }

        if (!user.subscription.isPremium) {
            return res.status(403).json({
                success: false,
                message: 'Tính năng này yêu cầu tài khoản premium'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra trạng thái premium'
        });
    }
}; 