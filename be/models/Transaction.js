const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null nếu là topup
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // null nếu là topup
  amount: { type: Number, required: true },
  type: { type: String, enum: ['topup', 'donate', 'donate-blog'], required: true },
  method: { type: String }, // vnpay, momo, ...
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, // chỉ cho donate
  status: { type: String, default: 'success' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 