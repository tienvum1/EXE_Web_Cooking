const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

// Thêm bình luận
router.post('/add', auth, commentController.addComment);
// Lấy bình luận theo recipe
router.get('/:recipeId', commentController.getCommentsByRecipe);
// Xóa bình luận
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router; 