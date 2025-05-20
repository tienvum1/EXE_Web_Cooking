const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middlewares/auth');

router.post('/create', auth, recipeController.create); // Bắt buộc phải đăng nhập mới tạo được
router.get('/', recipeController.getAll);
router.get('/:id', recipeController.getRecipeById);
router.get('/author/:id', recipeController.getAuthorRecipeById);

module.exports = router;