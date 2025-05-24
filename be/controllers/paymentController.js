const stripe = require('stripe')('***REMOVED***51RSHFA05kBhsFuj1EMkytliiac3LVzc7Vd3Aqkev3iBzsQpV7PpXRR9S1Hw5vT7dCuYs1w8TFHBSPDUEVa2ROq5V00PJBF9oKX');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Recipe = require('../models/Recipe');
const Notification = require('../models/Notification');
const notificationController = require('./notificationController');

console.log('Stripe key:', '***REMOVED***51RSHFA05kBhsFuj1EMkytliiac3LVzc7Vd3Aqkev3iBzsQpV7PpXRR9S1Hw5vT7dCuYs1w8TFHBSPDUEVa2ROq5V00PJBF9oKX');

exports.createStripePaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    if (!amount || amount < 1000) return res.status(400).json({ message: 'Số tiền không hợp lệ' });

    // Stripe yêu cầu số tiền là cent (1 USD = 100 cent)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // USD: cent
      currency: 'usd', // đổi sang 'usd' để test
      metadata: { userId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
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

    // Gửi thông báo nạp tiền
    await notificationController.createNotification(
      userId,
      'topup',
      `Bạn đã nạp ${amount.toLocaleString('vi-VN')}đ vào tài khoản thành công!`,
      { amount }
    );

    res.json({ message: 'Nạp tiền thành công', balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xác nhận nạp tiền', error: err.message });
  }
};

// API lấy số dư ví hiện tại của user
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await Wallet.findOne({ user: userId });
    res.json({ balance: wallet ? wallet.balance : 0 });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy số dư ví', error: err.message });
  }
};

// API donate cho tác giả recipe
exports.donateToAuthor = async (req, res) => {
  try {
    const { recipeId, amount, message } = req.body;
    if (!recipeId || !amount || amount < 1000) return res.status(400).json({ message: 'Số tiền không hợp lệ' });
    const userId = req.user.id;
    // Lấy recipe để biết tác giả
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Không tìm thấy recipe' });
    if (recipe.author.toString() === userId) return res.status(400).json({ message: 'Không thể donate cho chính mình' });
    // Lấy ví người gửi và nhận
    const fromWallet = await Wallet.findOne({ user: userId });
    const toWallet = await Wallet.findOneAndUpdate(
      { user: recipe.author },
      { $inc: { balance: amount } },
      { new: true, upsert: true }
    );
    if (!fromWallet || fromWallet.balance < amount) return res.status(400).json({ message: 'Số dư không đủ' });
    fromWallet.balance -= amount;
    await fromWallet.save();
    // Lưu transaction
    await Transaction.create({
      from: userId,
      to: recipe.author,
      amount,
      type: 'donate',
      message,
      recipe: recipeId
    });
    // Lấy tên tác giả và tên món ăn
    let authorName = '';
    let recipeTitle = '';
    try {
      // Populate author nếu cần
      if (recipe.author && typeof recipe.author === 'object' && recipe.author.name) {
        authorName = recipe.author.name || recipe.author.fullName || recipe.author.username || 'tác giả';
      } else {
        const author = await require('../models/User').findById(recipe.author);
        authorName = author?.name || author?.fullName || author?.username || 'tác giả';
      }
      recipeTitle = recipe.title || 'món ăn';
    } catch { recipeTitle = recipe.title || 'món ăn'; authorName = 'tác giả'; }
    // Gửi thông báo cho người donate
    await notificationController.createNotification(
      userId,
      'donate',
      `Bạn đã donate ${amount.toLocaleString('vi-VN')}đ cho ${authorName} với công thức "${recipeTitle}".`,
      { amount, recipeId, to: recipe.author, recipeTitle, authorName }
    );
    // Gửi thông báo cho tác giả nhận donate
    // Lấy tên người gửi
    let senderName = '';
    try {
      const sender = await require('../models/User').findById(userId);
      senderName = sender?.name || sender?.fullName || sender?.username || 'người dùng';
    } catch { senderName = 'người dùng'; }
    await notificationController.createNotification(
      recipe.author,
      'receive',
      `Bạn nhận được ${amount.toLocaleString('vi-VN')}đ donate từ ${senderName} cho công thức "${recipeTitle}".`,
      { amount, recipeId, from: userId, recipeTitle, senderName }
    );
    res.json({ message: 'Donate thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi donate', error: err.message });
  }
};