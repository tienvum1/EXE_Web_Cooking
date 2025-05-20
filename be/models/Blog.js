const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  paragraphs: [{ type: String, required: true }]
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String },
  authorAvatar: { type: String },
  tags: [String],
  sections: [SectionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Blog', BlogSchema);