const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middlewares/auth');

router.post('/create', auth, recipeController.create); // Bắt buộc phải đăng nhập mới tạo được
router.get('/', recipeController.getAll);
router.get('/newest', recipeController.getNewest);
router.get('/most-liked', recipeController.getMostLiked);
router.get('/:id', recipeController.getRecipeById);
router.get('/author/:id', recipeController.getAuthorRecipeById);
router.get('/find-by-ingredient', recipeController.findByIngredient);
router.get('/search', recipeController.search);
router.get('/me/all-recipes', auth, recipeController.getAllUserRecipes);
router.get('/me/published-recipes', auth, recipeController.getPublishedUserRecipes);
router.get('/me/draft-recipes', auth, recipeController.getDraftUserRecipes);

module.exports = router;