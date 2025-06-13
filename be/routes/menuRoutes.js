const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middlewares/auth');
const { requirePremium } = require('../middlewares/premium');

// Menu suggestion and generation
router.post('/suggest', auth, requirePremium, menuController.generateSuggestedMenu);

// Menu management
router.post('/save', auth, menuController.saveMenu);
router.get('/getMenus', auth, menuController.getUserMenus);

router.get('/:menuId', auth, menuController.getMenuDetails);
router.delete('/:menuId', auth, menuController.deleteMenu);
router.put('/:menuId', auth, menuController.updateMenu);

module.exports = router; 