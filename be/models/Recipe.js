// models/Recipe.js (ví dụ cho Mongoose)
const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  text: { type: String, required: true },
  images: [{
    // data: { type: Buffer }, // Dữ liệu nhị phân của ảnh bước làm
    url: { type: String }, // Lưu URL ảnh từ Cloudinary
    // contentType: { type: String } // Kiểu MIME của ảnh
  }] // Lưu dữ liệu nhị phân cho ảnh bước làm
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
  mainImage: { type: String }, // Lưu URL ảnh chính từ Cloudinary
  categories: [{ type: String, required: true }], // Danh mục món ăn (mảng)
  nutrition: NutritionSchema, // Thông tin dinh dưỡng
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft'
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đăng
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware để cập nhật updatedAt khi save
RecipeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Recipe', RecipeSchema); 