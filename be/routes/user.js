const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const upload = require('../middleware/upload');
const adminController = require('../controllers/adminController');
const { admin } = require('../middleware/authMiddleware');

router.get('/me', auth, userController.getMe);
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/:id', userController.getUserById);
router.get('/:id/recipes', userController.getUserWithRecipes);

// Route to follow/unfollow a user
// :userId is the ID of the user to follow/unfollow
router.post('/:userId/follow', auth, userController.followUnfollowUser);

// Route to update user profile
// :id is the ID of the user being updated
router.put('/:id', auth, userController.updateUserProfile);

// Route to change user password
// @access Private
router.put('/change-password', auth, userController.changePassword);

// API: Tổng số người dùng (admin)
router.get('/admin/total-users', auth, admin, adminController.getTotalUsers);
// API: Tổng số công thức (admin)
router.get('/admin/total-recipes', auth, admin, adminController.getTotalRecipes);
// API: Tổng doanh thu (admin)
router.get('/admin/total-revenue', auth, admin, adminController.getTotalRevenue);

module.exports = router;