const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:   { type: String, trim: true },
  password:   { type: String },
  fullName:   { type: String, trim: true },
  password_hash: { type: String, required: false },
  avatar:     { type: String },
  bio:        { type: String },
  introduce:  { type: String },
  email:      { type: String, trim: true, match: /.+@.+\..+/ },
  googleId: { type: String, unique: true, sparse: true },
  loginMethods: { type: [String], default: ['password'] },
  isActive:   { type: Boolean, default: false },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  recipes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  favorites:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  following:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
    isPremium: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);