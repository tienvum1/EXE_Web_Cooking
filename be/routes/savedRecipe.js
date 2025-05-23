const express = require('express');
const router = express.Router();
const savedRecipeController = require('../controllers/savedRecipeController');
const auth = require('../middlewares/auth');

// Lưu một recipe
router.post('/save', auth, savedRecipeController.saveRecipe);
// Bỏ lưu một recipe
router.post('/unsave', auth, savedRecipeController.unsaveRecipe);
// Lấy danh sách đã lưu
router.get('/list', auth, savedRecipeController.getSavedRecipes);

module.exports = router; 