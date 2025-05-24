const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.post('/stripe-create', auth, paymentController.createStripePaymentIntent);
router.post('/stripe-confirm', auth, paymentController.confirmStripeTopup);
router.get('/balance', auth, paymentController.getWalletBalance);
router.post('/donate', auth, paymentController.donateToAuthor);

module.exports = router;