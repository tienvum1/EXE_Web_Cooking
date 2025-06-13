const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null nếu là topup
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // null nếu là topup
  amount: { type: Number, required: true },
  type: { type: String, enum: ['topup', 'donate', 'donate-blog', 'withdraw-request','bank_transfer','register_premium'], required: true },
  method: { type: String }, // vnpay, momo, bank transfer, ...
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, // chỉ cho donate
  status: { type: String, enum: ['success', 'pending', 'approved', 'rejected', 'completed'], required: true },
  createdAt: { type: Date, default: Date.now },
  bankName: { type: String },
  accountNumber: { type: String },
  accountHolderName: { type: String },
  transferContent : {type:String }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 