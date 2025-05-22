const Recipe = require('../models/Recipe');
exports.getAll = async (req, res) => {
  try {
    const filter = { status: 'approved' };
    if (req.query.category) {
      filter.categories = { $in: [req.query.category] };
    }
    const recipes = await Recipe.find(filter).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách recipe', error: err.message });
  }
};
exports.create = async (req, res) => {
  try {
    const { title, desc, servings, cookTime, ingredients, steps, mainImage, nutrition, status, categories } = req.body;
    // Kiểm tra trường bắt buộc
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (title, ingredients, steps)' });
    }
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Cần chọn ít nhất 1 danh mục (category) cho món ăn.' });
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
      author: req.user.id,
      categories
    });
    res.status(201).json(recipe);
  } catch (err) {
    console.error('Lỗi tạo recipe:', err);
    res.status(500).json({ message: 'Lỗi tạo recipe', error: err.message });
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

// Lấy 8 món ăn mới nhất đã duyệt
exports.getNewest = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy món ăn mới nhất', error: err.message });
  }
};

// Lấy 4 recipe nhiều like nhất đã duyệt
exports.getMostLiked = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'approved' })
      .sort({ likes: -1 })
      .limit(4)
      .populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy recipe nhiều like nhất', error: err.message });
  }
};