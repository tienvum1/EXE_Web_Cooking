const express = require('express');
const router = express.Router();
const chatgptController = require('../controllers/chatgptController');

router.post('/', chatgptController.handleChat);

module.exports = router; 