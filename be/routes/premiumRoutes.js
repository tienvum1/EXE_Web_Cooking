const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premiumController');
// Route cho user
const auth = require('../middlewares/auth');

// Đăng ký gói premium (không cần requirePremium vì người dùng chưa là premium)
router.post('/subscribe', auth, premiumController.subscribePremium);

// Kiểm tra trạng thái premium (không cần requirePremium vì đây là chức năng kiểm tra trạng thái)
router.get('/status', auth, premiumController.checkPremiumStatus);

module.exports = router; 