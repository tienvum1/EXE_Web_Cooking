const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.post('/stripe-create', auth, paymentController.createStripePaymentIntent);
router.post('/stripe-confirm', auth, paymentController.confirmStripeTopup);
<<<<<<< HEAD
router.get('/balance', auth, paymentController.getWalletBalance);
router.post('/donate', auth, paymentController.donateToAuthor);
=======
>>>>>>> 951e2b41db4e422a23f49156e1cfb7e0a0129458

module.exports = router;