const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user', error: err.message });
  }
};

// Lấy thông tin user theo id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user', error: err.message });
  }
};

// Lấy thông tin user và các món ăn của user đó
exports.getUserWithRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    const recipes = await Recipe.find({ author: user._id, status: 'approved' })
      .select('title mainImage cookTime status type desc');
    res.json({ ...user.toObject(), recipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user và recipes', error: err.message });
  }
};
