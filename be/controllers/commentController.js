const Comment = require('../models/Comment');

// Thêm bình luận
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { recipeId, content } = req.body;
    if (!recipeId || !content) return res.status(400).json({ message: 'Thiếu thông tin' });
    const comment = await Comment.create({ user: userId, recipe: recipeId, content });
    await comment.populate('user', 'username avatar');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thêm bình luận', error: err.message });
  }
};

// Lấy bình luận theo recipe
exports.getCommentsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const comments = await Comment.find({ recipe: recipeId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy bình luận', error: err.message });
  }
};

// Xóa bình luận (chỉ cho phép user xóa bình luận của mình)
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    if (comment.user.toString() !== userId) return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
    await comment.deleteOne();
    res.json({ message: 'Đã xóa bình luận' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa bình luận', error: err.message });
  }
}; 