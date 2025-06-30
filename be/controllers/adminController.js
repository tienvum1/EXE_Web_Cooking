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

// Helper: Tạo khoảng thời gian bắt đầu và kết thúc cho từng loại
function getDateRange(type) {
  const now = new Date();
  let start, end;
  switch (type) {
    case 'day':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start);
      end.setDate(end.getDate() + 1);
      break;
    case 'week': {
      const dayOfWeek = now.getDay() || 7; // 1 (Mon) - 7 (Sun)
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1);
      end = new Date(start);
      end.setDate(end.getDate() + 7);
      break;
    }
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
      break;
    default:
      start = null;
      end = null;
  }
  return { start, end };
}

// API: Lấy tổng doanh thu theo mốc thời gian (ngày, tuần, tháng, năm)
exports.getRevenueByPeriod = async (req, res) => {
  try {
    const { type } = req.query; // type: day, week, month, year
    const { start, end } = getDateRange(type);
    if (!start || !end) return res.status(400).json({ message: 'Tham số type không hợp lệ' });
    const revenueTypes = ['topup', 'donate', 'donate-blog', 'register_premium'];
    const result = await Transaction.aggregate([
      { $match: {
          status: 'success',
          type: { $in: revenueTypes },
          createdAt: { $gte: start, $lt: end }
        }
      },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.json({ totalRevenue, type });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy doanh thu theo thời gian', error: err.message });
  }
};
