const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// @desc    Get AI menu suggestion
// @route   POST /api/ai/menu-suggestion
// @access  Public (or Private if authentication is needed for AI feature)
router.post('/menu-suggestion', aiController.menuSuggestion);

module.exports = router; 