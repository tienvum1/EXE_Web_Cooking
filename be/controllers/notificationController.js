const Notification = require('../models/Notification');

// Helper function to create notification
exports.createNotification = async (recipient, type, content, data = {}, sender = null, recipe = null) => {
  try {
    const notificationData = {
      recipient,
      type,
      content,
      data,
      read: false
    };

    // Only add optional fields if they are provided
    if (sender) notificationData.sender = sender;
    if (recipe) notificationData.recipe = recipe;

    const noti = await Notification.create(notificationData);

    // Emit socket notification if io is available
    if (global.io) {
      global.io.to(recipient.toString()).emit('notification', noti);
    }
    return noti;
  } catch (err) {
    console.error('Create notification error:', err);
    throw err;
  }
};

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username avatar')
      .populate('recipe', 'title mainImage')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Lỗi lấy thông báo', error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.json({ message: 'Đã đánh dấu đã đọc', notification });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Đã đánh dấu tất cả đã đọc' });
  } catch (err) {
    console.error('Mark all as read error:', err);
    res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const count = await Notification.countDocuments({ 
      recipient: userId, 
      read: false 
    });
    res.json({ count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ message: 'Lỗi lấy số thông báo chưa đọc', error: err.message });
  }
}; 