const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth, userController.getMe);
router.get('/:id', userController.getUserById);
router.get('/:id/recipes', userController.getUserWithRecipes);


module.exports = router;