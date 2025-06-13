const SavedRecipe = require('../models/SavedRecipe');
const Recipe = require('../models/Recipe');
const User = require('../models/User'); // Import User model

// Lưu một recipe
exports.saveRecipe = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ message: 'Thiếu recipeId' });

    // Kiểm tra trạng thái premium của người dùng
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    // Nếu người dùng không phải premium, kiểm tra giới hạn 5 công thức
    if (!user.isPremium) {
      const savedRecipesCount = await SavedRecipe.countDocuments({ user: userId });
      const MAX_FREE_SAVED_RECIPES = 5;
      if (savedRecipesCount >= MAX_FREE_SAVED_RECIPES) {
        return res.status(403).json({
          success: false,
          message: `Bạn đã đạt giới hạn ${MAX_FREE_SAVED_RECIPES} công thức được lưu. Vui lòng đăng ký gói Premium để lưu không giới hạn!`
        });
      }
    }

    // Kiểm tra đã lưu chưa
    const exists = await SavedRecipe.findOne({ user: userId, recipe: recipeId });
    if (exists) return res.status(400).json({ message: 'Đã lưu công thức này' });

    const saved = await SavedRecipe.create({ user: userId, recipe: recipeId });
    res.status(201).json(saved);
  } catch (err) {
    console.error('Lỗi lưu công thức:', err);
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
    console.error('Lỗi bỏ lưu công thức:', err);
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
    console.error('Lỗi lấy danh sách đã lưu:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách đã lưu', error: err.message });
  }
}; 