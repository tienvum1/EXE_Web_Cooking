const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, protectSetPassword } = require('../middlewares/authMiddleware');
const passport = require('passport'); // Import passport here
const auth = require('../middlewares/auth');

// @desc    Register user with email and password
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authController.register);

// @desc    Verify email address
// @route   GET /api/auth/verify-email
// @access  Public
router.get('/verify-email', authController.verifyEmail);

// @desc    Login user with email and password
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authController.login);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public (Frontend handles token removal)
router.post('/logout', authController.logout);

// @desc    Initiate Google OAuth process
// @route   GET /api/auth/google
// @access  Public
router.get('/google', authController.googleLogin); // Calls the googleLogin function in controller

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
// Passport handles the authentication success/failure internally and redirects
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_ORIGIN}/login?error=google_auth_failed` }),
  authController.googleCallback // Calls the googleCallback function after successful authentication
);

// @desc    Set password for a user (e.g., after Google login)
// @route   POST /api/auth/set-password
// @access  Private (requires token, handled by middleware)
router.post('/set-password', protectSetPassword, authController.setPassword);

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private (requires token, handled by middleware)
router.get('/me', auth, authController.getMe);

// @desc    Initiate password reset
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
