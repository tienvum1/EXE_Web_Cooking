const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const likeController = require('../controllers/likeController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu file ảnh
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// === Tạm thời sử dụng upload.any() để chẩn đoán lỗi Unexpected Field ===
// CẢNH BÁO: upload.any() chấp nhận mọi loại file và không lý tưởng cho production.
router.post(
  '/create',
  auth,
  upload.any(), // Chấp nhận mọi trường file
  function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.field, err.code, err.message);
      return res.status(400).json({ message: `Upload error: ${err.message} (Field: ${err.field})` });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(500).json({ message: 'An unknown error occurred during upload.' });
    }
    next();
  },
  recipeController.create
);
// ====================================================================

// Like routes - đặt trước route /:id để tránh conflict
router.post('/like', auth, likeController.likeRecipe);
router.get('/like-status/:recipeId', auth, likeController.checkLikeStatus);

router.get('/', recipeController.getAll);
router.get('/newest', recipeController.getNewest);
router.get('/most-liked', recipeController.getMostLiked);
// Route để lấy danh sách recipe chờ duyệt (Chỉ admin)
router.get('/pendings', auth, recipeController.getPendingRecipes);
router.get('/pendings/:id', auth, recipeController.getRecipeById);

router.get('/:id', recipeController.getRecipeApproveById);
router.get('/author/:id', recipeController.getAuthorRecipeById);
router.get('/find-by-ingredient', recipeController.findByIngredient);
router.get('/search', recipeController.search);

router.get('/me/all-recipes', auth, recipeController.getAllUserRecipes);
router.get('/me/published-recipes', auth, recipeController.getPublishedUserRecipes);
router.get('/me/draft-recipes', auth, recipeController.getDraftUserRecipes);
router.get('/me/pendings', auth, recipeController.getUserPendingRecipes);

router.put(
  '/:id',
  auth,
  upload.any(),
  function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error during PUT:', err.field, err.code, err.message);
      return res.status(400).json({ message: `Upload error: ${err.message} (Field: ${err.field})` });
    } else if (err) {
      console.error('Unknown upload error during PUT:', err);
      return res.status(500).json({ message: 'An unknown error occurred during upload.' });
    }
    next();
  },
  recipeController.updateRecipe
);
router.delete('/:id', auth, recipeController.deleteRecipe);

// Add route for generating recipe PDF
router.get('/:id/pdf', recipeController.generateRecipePdf);

// Route để cập nhật trạng thái recipe (Chỉ admin)
router.put('/:id/status', auth, recipeController.updateRecipeStatus);

module.exports = router;