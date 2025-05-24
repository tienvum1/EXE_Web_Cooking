const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/auth');

router.get('/history', auth, transactionController.getTransactionHistory);

module.exports = router;