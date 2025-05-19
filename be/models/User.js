const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true, trim: true },
  password:   { type: String, required: true },
  fullName:   { type: String, trim: true },
  avatar:     { type: String },
  bio:        { type: String },
  introduce:  { type: String },
  email:      { type: String, trim: true, match: /.+@.+\..+/ },
  isActive:   { type: Boolean, default: true },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  recipes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  favorites:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);