const Transaction = require('../models/Transaction');

// Lấy lịch sử giao dịch của user
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({
      $or: [
        { to: userId },
        { from: userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử giao dịch', error: err.message });
  }
};
