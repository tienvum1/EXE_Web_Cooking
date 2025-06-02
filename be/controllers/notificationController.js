const Notification = require('../models/Notification');

exports.createNotification = async (user, type, content, data = {}) => {
  const noti = await Notification.create({ user, type, content, data });
  // Emit socket nếu có io
  if (global.io) {
    global.io.to(user.toString()).emit('notification', noti);
  }
  return noti;
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const noti = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json(noti);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông báo', error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    await Notification.updateOne({ _id: id, user: userId }, { $set: { read: true } });
    res.json({ message: 'Đã đánh dấu đã đọc' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
  }
}; 