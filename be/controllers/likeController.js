const Like = require('../models/Like');
const Recipe = require('../models/Recipe');
const notificationController = require('./notificationController');
const User = require('../models/User');

// Like/Unlike a recipe
exports.likeRecipe = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: 'Thiếu recipeId' });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId).populate('author');
    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ user: userId, recipe: recipeId });
    
    if (existingLike) {
      // If already liked, remove the like
      await Like.findOneAndDelete({ user: userId, recipe: recipeId });
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { $inc: { likes: -1 } },
        { new: true }
      );
      return res.json({ 
        message: 'Đã bỏ like công thức', 
        likes: updatedRecipe.likes,
        liked: false
      });
    } else {
      // If not liked, add new like
      await Like.create({ user: userId, recipe: recipeId });
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { $inc: { likes: 1 } },
        { new: true }
      );

      // Create notification for recipe author if it's not the same user
      if (recipe.author._id.toString() !== userId.toString()) {
        // Get liker's info
        const liker = await User.findById(userId);
        const likerName = liker.fullName || liker.username;

        await notificationController.createNotification(
          recipe.author._id, // recipient
          'like', // type
          `${likerName} đã thích công thức "${recipe.title}" của bạn`, // content
          {}, // data
          userId, // sender
          recipeId // recipe
        );
      }

      return res.status(201).json({ 
        message: 'Đã like công thức', 
        likes: updatedRecipe.likes,
        liked: true
      });
    }
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ 
      message: 'Lỗi thao tác like', 
      error: err.message 
    });
  }
};

// Check if user has liked a recipe
exports.checkLikeStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ message: 'Thiếu recipeId' });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy công thức' });
    }

    const like = await Like.findOne({ user: userId, recipe: recipeId });
    res.json({ liked: !!like });
  } catch (err) {
    console.error('Check like status error:', err);
    res.status(500).json({ 
      message: 'Lỗi kiểm tra trạng thái like', 
      error: err.message 
    });
  }
}; 