// models/Recipe.js (ví dụ cho Mongoose)
const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  text: { type: String, required: true },
  images: [{ type: String }] // Lưu URL hoặc đường dẫn ảnh
});

const NutritionSchema = new mongoose.Schema({
  calories: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 }
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Tên món ăn
  desc: { type: String }, // Mô tả món ăn
  servings: { type: String }, // Khẩu phần (ví dụ: "2 người")
  cookTime: { type: String }, // Thời gian nấu (ví dụ: "1 tiếng 30 phút")
  ingredients: [{ type: String, required: true }], // Danh sách nguyên liệu
  steps: [StepSchema], // Các bước làm
  mainImage: { type: String }, // Ảnh chính của món ăn (URL hoặc đường dẫn)
  nutrition: NutritionSchema, // Thông tin dinh dưỡng
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đăng
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema); 