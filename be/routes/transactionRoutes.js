const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route cho user
const auth = require('../middlewares/auth');

router.get('/history', auth, transactionController.getTransactionHistory);


router.post('/topup', auth, transactionController.createTopupTransaction);

// Route cho admin
router.get('/pending-topup', protect, admin, transactionController.getPendingTopupRequests);
router.put('/topup/:transactionId', protect, admin, transactionController.handleTopupRequest);

module.exports = router; 