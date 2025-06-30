const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { admin } = require('../middleware/authMiddleware');
const auth = require('../middlewares/auth');

// Tổng số người dùng
router.get('/total-users', auth, admin, adminController.getTotalUsers);
// Tổng số công thức
router.get('/total-recipes', auth, admin, adminController.getTotalRecipes);
// Tổng doanh thu
router.get('/total-revenue', auth, admin, adminController.getTotalRevenue);
// Tổng doanh thu theo ngày, tuần, tháng, năm
router.get('/revenue-by-period', auth, admin, adminController.getRevenueByPeriod);
// Tổng hợp user, recipe, revenue theo tuần/tháng
router.get('/summary-by-period', auth, admin, adminController.getSummaryByPeriod);
// Thống kê theo ngày, tuần, tháng của 1 tháng bất kỳ
router.get('/summary-by-month', adminController.getSummaryByMonth);

router.get('/test', (req, res) => res.json({ ok: true }));

module.exports = router; 