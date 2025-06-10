const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for system notifications
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  type: { 
    type: String, 
    enum: [
      'topup', 
      'donate', 
      'receive', 
      'follow', 
      'receive-blog-donate', 
      'withdrawal-requested', 
      'withdrawal-status-update', 
      'like'
    ], 
    required: true 
  },
  content: { type: String, required: true },
  data: { 
    amount: Number,
    method: String,
    status: String,
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema); 