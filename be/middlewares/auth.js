const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // Lấy token từ cookie
  const token = req.cookies.token;
  console.log("token get me", token);
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Chưa đăng nhập' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Token không hợp lệ' 
    });
  }
};