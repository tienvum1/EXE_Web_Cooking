const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  meals: [{
    name: {
      type: String,
      required: true
    },
    recipes: [{
      recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
      },
      time: String,
      type: String
    }],
    nutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', menuSchema); 