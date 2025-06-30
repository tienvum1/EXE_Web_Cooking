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

module.exports = router; 