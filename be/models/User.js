const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar:   { type: String },
  fullName: { type: String },
  bio:      { type: String },
  gender:   { type: String },
  birthday: { type: Date },
  recipes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  favorites:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  role:     { type: String, default: 'user' },
  settings: {
    theme: String,
    language: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});
module.exports = mongoose.model('User', UserSchema);