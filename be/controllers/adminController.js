const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Transaction = require('../models/Transaction');

// API: Lấy tổng số người dùng
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tổng số người dùng', error: err.message });
  }
};

// API: Lấy tổng số công thức
exports.getTotalRecipes = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    res.json({ totalRecipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tổng số công thức', error: err.message });
  }
};

// API: Lấy tổng doanh thu (tính tổng amount của các transaction thành công)
exports.getTotalRevenue = async (req, res) => {
  try {
    // Chỉ tính các transaction có status là 'success' và type là topup, donate, donate-blog, register_premium
    const revenueTypes = ['topup', 'donate', 'donate-blog', 'register_premium'];
    const result = await Transaction.aggregate([
      { $match: { status: 'success', type: { $in: revenueTypes } } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.json({ totalRevenue });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tổng doanh thu', error: err.message });
  }
};
