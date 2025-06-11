const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const upload = require('../middleware/upload');

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

module.exports = router;