const mongoose = require('mongoose');
const HealthToolHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tool: String, // 'bmi', 'bmr', 'weight'
  input: Object,
  result: Object,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('HealthToolHistory', HealthToolHistorySchema);