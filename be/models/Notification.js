const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['topup', 'donate', 'receive', 'follow', 'receive-blog-donate', 'withdrawal-requested', 'withdrawal-status-update'], required: true },
  content: { type: String, required: true },
  data: { type: Object }, // Thông tin phụ (amount, from, to, status, v.v.)
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Notification', NotificationSchema); 