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

// API: Tổng hợp user, recipe, revenue theo thời gian (tuần/tháng)
exports.getSummaryByPeriod = async (req, res) => {
  try {
    const { type } = req.query; // type: week, month
    const { start, end } = getDateRange(type);
    if (!start || !end) return res.status(400).json({ message: 'Tham số type không hợp lệ' });
    const [totalUsers, totalRecipes, revenueResult] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Transaction.aggregate([
        { $match: {
            status: 'success',
            type: { $in: ['topup', 'donate', 'donate-blog', 'register_premium'] },
            createdAt: { $gte: start, $lt: end }
          }
        },
        { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
      ])
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    res.json({ totalUsers, totalRecipes, totalRevenue, type });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tổng hợp thống kê', error: err.message });
  }
};

// Helper: Lấy số tuần trong tháng
function getWeeksInMonth(year, month) {
  const weeks = [];
  let date = new Date(year, month, 1);
  let week = [];
  while (date.getMonth() === month) {
    week.push(new Date(date));
    if (date.getDay() === 0) { // Chủ nhật kết thúc tuần
      weeks.push(week);
      week = [];
    }
    date.setDate(date.getDate() + 1);
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

// API: Thống kê theo ngày hoặc tuần của tháng
exports.getSummaryByMonth = async (req, res) => {
  try {
    const { year, month, type } = req.query; // month: 0-11, year: 2024, type: 'day'|'week'
    const y = parseInt(year);
    const m = parseInt(month);
    if (isNaN(y) || isNaN(m) || m < 0 || m > 11) return res.status(400).json({ message: 'Tham số tháng/năm không hợp lệ' });
    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 1);
    const revenueTypes = ['topup', 'donate', 'donate-blog', 'register_premium'];

    if (type === 'day') {
      // Thống kê từng ngày trong tháng
      const days = [];
      for (let d = 1; d <= endOfMonth.getDate() || (new Date(y, m, d)).getMonth() === m; d++) {
        const dayStart = new Date(y, m, d);
        const dayEnd = new Date(y, m, d + 1);
        const [totalUsers, totalRecipes, revenueResult] = await Promise.all([
          User.countDocuments({ createdAt: { $gte: dayStart, $lt: dayEnd } }),
          Recipe.countDocuments({ createdAt: { $gte: dayStart, $lt: dayEnd } }),
          Transaction.aggregate([
            { $match: {
                status: 'success',
                type: { $in: revenueTypes },
                createdAt: { $gte: dayStart, $lt: dayEnd }
              }
            },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
          ])
        ]);
        days.push({
          date: dayStart,
          totalUsers,
          totalRecipes,
          totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0
        });
      }
      return res.json({ type: 'day', days });
    } else if (type === 'week') {
      // Thống kê từng tuần trong tháng
      const weeks = getWeeksInMonth(y, m);
      const weekStats = [];
      for (const week of weeks) {
        const weekStart = week[0];
        const weekEnd = new Date(week[week.length - 1]);
        weekEnd.setDate(weekEnd.getDate() + 1);
        const [totalUsers, totalRecipes, revenueResult] = await Promise.all([
          User.countDocuments({ createdAt: { $gte: weekStart, $lt: weekEnd } }),
          Recipe.countDocuments({ createdAt: { $gte: weekStart, $lt: weekEnd } }),
          Transaction.aggregate([
            { $match: {
                status: 'success',
                type: { $in: revenueTypes },
                createdAt: { $gte: weekStart, $lt: weekEnd }
              }
            },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
          ])
        ]);
        weekStats.push({
          weekStart,
          weekEnd,
          totalUsers,
          totalRecipes,
          totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0
        });
      }
      return res.json({ type: 'week', weeks: weekStats });
    } else {
      // Tổng hợp cả tháng
      const [totalUsers, totalRecipes, revenueResult] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
        Recipe.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
        Transaction.aggregate([
          { $match: {
              status: 'success',
              type: { $in: revenueTypes },
              createdAt: { $gte: startOfMonth, $lt: endOfMonth }
            }
          },
          { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ])
      ]);
      return res.json({
        type: 'month',
        totalUsers,
        totalRecipes,
        totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê theo tháng', error: err.message });
  }
};
