const jwt = require('jsonwebtoken');
const config = require('../config');
exports.sign = (payload) => jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });