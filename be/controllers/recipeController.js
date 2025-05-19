const Recipe = require('../models/Recipe');
exports.getAll = async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
};
exports.create = async (req, res) => {
  const recipe = await Recipe.create(req.body);
  res.json(recipe);
};
exports.getById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Not found' });
  res.json(recipe);
};
exports.update = async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(recipe);
};
exports.delete = async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};