const SavedRecipe = require('../models/SavedRecipe');
const Recipe = require('../models/Recipe');

// Lưu một recipe
exports.saveRecipe = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: 'Thiếu recipeId' });
    // Kiểm tra đã lưu chưa
    const exists = await SavedRecipe.findOne({ user: userId, recipe: recipeId });
    if (exists) return res.status(400).json({ message: 'Đã lưu công thức này' });
    const saved = await SavedRecipe.create({ user: userId, recipe: recipeId });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lưu công thức', error: err.message });
  }
};

// Bỏ lưu một recipe
exports.unsaveRecipe = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: 'Thiếu recipeId' });
    const deleted = await SavedRecipe.findOneAndDelete({ user: userId, recipe: recipeId });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy mục đã lưu' });
    res.json({ message: 'Đã bỏ lưu công thức' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi bỏ lưu công thức', error: err.message });
  }
};

// Lấy danh sách recipe đã lưu của user
exports.getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const saved = await SavedRecipe.find({ user: userId }).populate({ path: 'recipe', populate: { path: 'author', select: 'username' } }).sort({ createdAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách đã lưu', error: err.message });
  }
}; 