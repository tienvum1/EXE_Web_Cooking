const Recipe = require('../models/Recipe');
exports.getAll = async (req, res) => {
  try {
    // Chỉ lấy recipe đã duyệt
    const recipes = await Recipe.find({ status: 'approved' }).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách recipe', error: err.message });
  }
};
exports.create = async (req, res) => {
  try {
    const { title, desc, servings, cookTime, ingredients, steps, mainImage, nutrition, status } = req.body;
    // Kiểm tra trường bắt buộc
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (title, ingredients, steps)' });
    }
    // Tạo recipe mới, lấy author từ req.user.id
    const recipe = await Recipe.create({
      title,
      desc,
      servings,
      cookTime,
      ingredients,
      steps,
      mainImage,
      nutrition,
      status: status || 'draft',
      author: req.user.id
    });
    res.status(201).json(recipe);
  } catch (err) {
    console.error('Lỗi tạo recipe:', err);
    res.status(500).json({ message: 'Lỗi tạo recipe', error: err.message });
  }
};
// Lấy tất cả recipe đã duyệt
exports.getAll = async (req, res) => {
  try {
    // Chỉ lấy recipe đã duyệt
    const recipes = await Recipe.find({ status: 'approved' }).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách recipe', error: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username createdAt',);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy recipe', error: err.message });
  }
};

exports.getAuthorRecipeById = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.id }).populate('author', 'username createdAt');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy recipe', error: err.message });
  }
};