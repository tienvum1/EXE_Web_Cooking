const Recipe = require('../models/Recipe');
const Menu = require('../models/Menu');
const User = require('../models/User');

/**
 * Helper function to parse cookTime string (e.g., "1 tiếng 30 phút", "45 phút") to total minutes.
 * This is necessary because cookTime is stored as a string in the database,
 * but the frontend provides a numerical cooking time for filtering.
 * For optimal performance and standard practice, it's recommended to store
 * cookTime as a numerical value (e.g., total minutes) directly in the database.
 * @param {string} cookTimeString - The cook time string from the database.
 * @returns {number} The total cook time in minutes.
 */
const parseCookTimeToMinutes = (cookTimeString) => {
  if (typeof cookTimeString !== 'string' || !cookTimeString) {
    return 0; 
  }
  
  let totalMinutes = 0;
  const lowerCaseCookTimeString = cookTimeString.toLowerCase();

  const hoursMatch = lowerCaseCookTimeString.match(/(\d+)\s*tiếng/);
  const minutesMatch = lowerCaseCookTimeString.match(/(\d+)\s*phút/);

  if (hoursMatch) {
    totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  }
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1], 10);
  }
  return totalMinutes;
};

/**
 * Generates a suggested menu based on user preferences and meal requirements.
 * This API endpoint processes an array of meal requests, dynamically building
 * database queries to find matching recipes based on cooking time, calories,
 * diet type (categories), included/excluded ingredients, and desired number of recipes.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
exports.generateSuggestedMenu = async (req, res) => {
  try {
    const { meals } = req.body;
    console.log("Received meals request:", meals);
    
    if (!meals || !Array.isArray(meals) || meals.length === 0) {
      return res.status(400).json({ message: "Vui lòng cung cấp thông tin bữa ăn hợp lệ." });
    }

    const suggestedMenu = [];

    const mealTypeCategoryMap = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối',
    };

    for (const mealRequest of meals) {
      const { 
        type, 
        cookingTime, 
        calories, 
        dietType, 
        includeIngredients, 
        excludeIngredients, 
        numberOfRecipes 
      } = mealRequest;

      console.log("Processing meal request:", {
        type,
        cookingTime,
        calories,
        dietType,
        includeIngredients,
        excludeIngredients,
        numberOfRecipes
      });

      const parsedCookingTime = parseInt(cookingTime, 10);
      const parsedCalories = parseInt(calories, 10);
      const parsedNumberOfRecipes = parseInt(numberOfRecipes, 10);

      if (isNaN(parsedCookingTime) || parsedCookingTime <= 0) {
        return res.status(400).json({ message: `Thời gian nấu cho ${type} phải là số nguyên dương hợp lệ.` });
      }
      if (isNaN(parsedCalories) || parsedCalories <= 0) {
        return res.status(400).json({ message: `Lượng calo cho ${type} phải là số nguyên dương hợp lệ.` });
      }
      if (isNaN(parsedNumberOfRecipes) || parsedNumberOfRecipes <= 0) {
        return res.status(400).json({ message: `Số món ăn cho ${type} phải là số nguyên dương hợp lệ.` });
      }

      const cookingTimePerRecipe = Math.floor(parsedCookingTime / parsedNumberOfRecipes);
      const caloriesPerRecipe = Math.floor(parsedCalories / parsedNumberOfRecipes);

      console.log("Calculated per recipe limits:", {
        cookingTimePerRecipe,
        caloriesPerRecipe
      });

      const categoryName = mealTypeCategoryMap[type];
      if (!categoryName) {
        return res.status(400).json({ message: `Loại bữa ăn không hợp lệ: ${type}.` });
      }

      const pipeline = [];

      // Đơn giản hóa điều kiện tìm kiếm ban đầu
      const matchConditions = {
        categories: categoryName
      };

      console.log("Initial match conditions:", matchConditions);

      pipeline.push({ $match: matchConditions });

      // Thêm stage để chuyển đổi cookTime thành phút
      pipeline.push({
        $addFields: {
          cookTimeInMinutes: {
            $add: [
              { $multiply: [
                { $ifNull: [{
                  $toInt: {
                    $arrayElemAt: [
                      { $regexFind: { input: "$cookTime", regex: /(\d+)\s*tiếng/ } },
                      1
                    ]
                  }
                }, 0] },
                60
              ]},
              { $ifNull: [{
                $toInt: {
                  $arrayElemAt: [
                    { $regexFind: { input: "$cookTime", regex: /(\d+)\s*phút/ } },
                    1
                  ]
                }
              }, 0] }
            ]
          }
        }
      });

      // Thêm điều kiện về thời gian nấu
      pipeline.push({ 
        $match: { 
          cookTimeInMinutes: { $lte: cookingTimePerRecipe }
        } 
      });

      // Thêm điều kiện về calories
      pipeline.push({ 
        $match: { 
          'nutrition.calories': { $lte: caloriesPerRecipe }
        } 
      });

      // Thêm điều kiện về nguyên liệu nếu có
      if (Array.isArray(includeIngredients) && includeIngredients.length > 0) {
        pipeline.push({
          $match: {
            ingredients: {
              $all: includeIngredients.map(ing => new RegExp(ing.trim(), 'i'))
            }
          }
        });
      }

      if (Array.isArray(excludeIngredients) && excludeIngredients.length > 0) {
        pipeline.push({
          $match: {
            ingredients: {
              $nin: excludeIngredients.map(ing => new RegExp(ing.trim(), 'i'))
            }
          }
        });
      }

      // Thêm điều kiện về loại chế độ ăn nếu có
      if (Array.isArray(dietType) && dietType.length > 0) {
        const filteredDietTypes = dietType.filter(dt => dt !== categoryName && dt !== "");
        if (filteredDietTypes.length > 0) {
          pipeline.push({
            $match: {
              categories: { $in: filteredDietTypes }
            }
          });
        }
      }

      // Lookup thông tin tác giả
      pipeline.push({
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo"
        }
      });

      // Project các trường cần thiết
      pipeline.push({
        $project: {
          _id: 1,
          name: "$title",
          description: "$desc",
          ingredients: 1,
          instructions: 1,
          cookTime: 1,
          calories: "$nutrition.calories",
          nutrition: {
            calories: "$nutrition.calories",
            protein: "$nutrition.protein",
            carbs: "$nutrition.carbs",
            fat: "$nutrition.fat"
          },
          categories: 1,
          mainImage: 1,
          author: {
            _id: { $arrayElemAt: ["$authorInfo._id", 0] },
            name: { $arrayElemAt: ["$authorInfo.name", 0] },
            email: { $arrayElemAt: ["$authorInfo.email", 0] },
            avatar: { $arrayElemAt: ["$authorInfo.avatar", 0] },
            role: { $arrayElemAt: ["$authorInfo.role", 0] }
          }
        }
      });

      // Giới hạn số lượng công thức
      pipeline.push({ $limit: parsedNumberOfRecipes });

      console.log("Final pipeline:", JSON.stringify(pipeline, null, 2));

      const recipes = await Recipe.aggregate(pipeline);
      console.log("Found recipes:", recipes.length);

      if (recipes.length === 0) {
        return res.status(404).json({
          message: `Không tìm thấy công thức phù hợp cho ${type} với các tiêu chí đã chọn. Vui lòng thử điều chỉnh tiêu chí tìm kiếm hoặc kiểm tra dữ liệu.`
        });
      }

      suggestedMenu.push({
        mealType: type,
        recipes: recipes
      });
    }

    console.log("Final suggested menu:", JSON.stringify(suggestedMenu, null, 2));
    res.status(200).json(suggestedMenu);
  } catch (error) {
    console.error("Error generating menu:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi tạo thực đơn gợi ý. Vui lòng thử lại sau." });
  }
};

exports.saveMenu = async (req, res) => {
  try {
    const { menu, name } = req.body;
    const userId = req.user.user_id;

    if (!menu || !Array.isArray(menu)) {
      return res.status(400).json({ message: 'Dữ liệu menu không hợp lệ' });
    }

    const menuData = {
      user: userId,
      name: name || 'Thực đơn mới',
      meals: menu.map(meal => ({
        mealType: meal.mealType,
        recipes: meal.recipes.map(recipe => recipe._id),
        nutrition: {
          calories: meal.recipes.reduce((sum, r) => sum + (r.calories || 0), 0),
          protein: meal.recipes.reduce((sum, r) => sum + (r.nutrition?.protein || 0), 0),
          carbs: meal.recipes.reduce((sum, r) => sum + (r.nutrition?.carbs || 0), 0),
          fat: meal.recipes.reduce((sum, r) => sum + (r.nutrition?.fat || 0), 0)
        }
      }))
    };

    const savedMenu = await Menu.create(menuData);
    await savedMenu.populate({
      path: 'meals.recipes',
      select: 'title mainImage cookTime nutrition categories',
      populate: {
        path: 'author',
        select: 'fullName avatar'
      }
    });

    res.status(201).json({
      message: 'Lưu thực đơn thành công',
      menu: savedMenu
    });
  } catch (error) {
    console.error('Error saving menu:', error);
    res.status(500).json({ message: 'Lỗi khi lưu thực đơn' });
  }
};

// New function to get user's menus
exports.getUserMenus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const menus = await Menu.find({ user: userId })
      .populate({
        path: 'meals.recipes',
        select: 'title mainImage cookTime nutrition categories',
        populate: {
          path: 'author',
          select: 'fullName avatar'
        }
      })
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
    console.log(menus)
    res.status(200).json(menus);
    console.log(menus)
  } catch (error) {
    console.error('Error fetching user menus:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thực đơn của người dùng' });
  }
};

// Get menu details by ID
exports.getMenuDetails = async (req, res) => {
    try {
        const { menuId } = req.params;
        const userId = req.user.user_id;

        const menu = await Menu.findOne({ _id: menuId, user: userId })
            .populate({
                path: 'meals.recipes',
                select: 'title mainImage cookTime nutrition categories ingredients instructions',
                populate: {
                    path: 'author',
                    select: 'fullName avatar'
                }
            });

        if (!menu) {
            return res.status(404).json({ message: 'Không tìm thấy thực đơn' });
        }

        // Calculate total nutrition for the menu
        const totalNutrition = menu.meals.reduce((total, meal) => {
            return {
                calories: total.calories + (meal.nutrition.calories || 0),
                protein: total.protein + (meal.nutrition.protein || 0),
                carbs: total.carbs + (meal.nutrition.carbs || 0),
                fat: total.fat + (meal.nutrition.fat || 0)
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        res.status(200).json({
            menu,
            totalNutrition
        });
    } catch (error) {
        console.error('Error fetching menu details:', error);
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết thực đơn' });
    }
};

// Delete a menu
exports.deleteMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const userId = req.user.user_id;

        const menu = await Menu.findOneAndDelete({ _id: menuId, user: userId });
        
        if (!menu) {
            return res.status(404).json({ message: 'Không tìm thấy thực đơn' });
        }

        res.status(200).json({ message: 'Xóa thực đơn thành công' });
    } catch (error) {
        console.error('Error deleting menu:', error);
        res.status(500).json({ message: 'Lỗi khi xóa thực đơn' });
    }
};

// Update a menu
exports.updateMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const { name, meals } = req.body;
        const userId = req.user.user_id;

        const menu = await Menu.findOneAndUpdate(
            { _id: menuId, user: userId },
            { 
                name,
                meals: meals.map(meal => ({
                    mealType: meal.mealType,
                    recipes: meal.recipes.map(recipe => recipe._id),
                    nutrition: {
                        calories: meal.recipes.reduce((sum, r) => sum + (r.calories || 0), 0),
                        protein: meal.recipes.reduce((sum, r) => sum + (r.nutrition?.protein || 0), 0),
                        carbs: meal.recipes.reduce((sum, r) => sum + (r.nutrition?.carbs || 0), 0),
                        fat: meal.recipes.reduce((sum, r) => sum + (r.nutrition?.fat || 0), 0)
                    }
                })),
                updatedAt: new Date()
            },
            { new: true }
        ).populate({
            path: 'meals.recipes',
            select: 'title mainImage cookTime nutrition categories',
            populate: {
                path: 'author',
                select: 'fullName avatar'
            }
        });

        if (!menu) {
            return res.status(404).json({ message: 'Không tìm thấy thực đơn' });
        }

        res.status(200).json({
            message: 'Cập nhật thực đơn thành công',
            menu
        });
    } catch (error) {
        console.error('Error updating menu:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thực đơn' });
    }
};


