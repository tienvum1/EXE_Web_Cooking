require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cooking';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ username và password.' });
    }

    // Kiểm tra username đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username đã tồn tại.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({ username, password: hashedPassword });

    // Trả về user không có password, KHÔNG trả về token
    const { password: pw, ...userData } = user._doc;
    res.status(201).json({ message: 'Đăng ký thành công!', user: userData });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi đăng ký. Vui lòng thử lại sau.', error: err.message });
  }
};

// Đăng nhập tài khoản
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập username và password.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Username không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Gửi token qua cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Để true nếu deploy HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    const { password: pw, ...userData } = user._doc;
    res.json({ user: userData, message: 'Đăng nhập thành công!' });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi đăng nhập. Vui lòng thử lại sau.', error: err.message });
  }
};
// logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Đã đăng xuất' });
};