const Recipe = require('../models/Recipe');
exports.getAll = async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
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

// Lấy tất cả recipe
exports.getAll = async (req, res) => {
  try {
    // Lấy tất cả recipe, có thể populate author nếu muốn
    const recipes = await Recipe.find().populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách recipe', error: err.message });
  }
};