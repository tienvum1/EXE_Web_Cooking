const Stripe = require('stripe');
const stripe = Stripe('***REMOVED***...'); // Thay bằng secret key của bạn
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

exports.createStripePaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    if (!amount || amount < 1000) return res.status(400).json({ message: 'Số tiền không hợp lệ' });

    // Stripe yêu cầu số tiền là cent (1 USD = 100 cent)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // VNĐ, nếu dùng USD thì *100
      currency: 'vnd', // hoặc 'usd'
      metadata: { userId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo thanh toán Stripe', error: err.message });
  }
};

// Xác nhận nạp tiền sau khi thanh toán thành công (webhook hoặc FE gọi)
exports.confirmStripeTopup = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Thanh toán chưa thành công' });
    }
    const userId = paymentIntent.metadata.userId;
    const amount = paymentIntent.amount;

    // Cộng tiền vào ví
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) wallet = await Wallet.create({ user: userId });
    wallet.balance += amount;
    wallet.updatedAt = new Date();
    await wallet.save();

    // Lưu transaction
    await Transaction.create({ from: null, to: userId, amount, type: 'topup', method: 'stripe', status: 'success' });

    res.json({ message: 'Nạp tiền thành công', balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xác nhận nạp tiền', error: err.message });
  }
};