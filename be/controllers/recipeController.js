const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const pdf = require('html-pdf'); // Require the html-pdf library
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '******' : undefined, // Mask API Key for logs
  api_secret: process.env.CLOUDINARY_API_SECRET ? '******' : undefined // Mask API Secret
});

// Middleware to check for admin role (assuming user is attached by auth middleware)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ admin mới có quyền thực hiện thao tác này.' });
  }
};

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
    const { title, desc, servings, cookTime, ingredients, steps, nutrition, status, categories } = req.body;
    console.log(req.body);
    const uploadedFiles = req.files; // Array of all uploaded files

    // Get main image file info
    const mainImageFile = uploadedFiles ? uploadedFiles.find(file => file.fieldname === 'mainImage') : null;

    // Upload main image to Cloudinary FIRST
    let mainImageUrl = null;
    if (mainImageFile) {
      try {
        const result = await cloudinary.uploader.upload(
          `data:${mainImageFile.mimetype};base64,${mainImageFile.buffer.toString('base64')}`,
          {
            folder: 'recipe_main_images' // Optional: specify a folder in Cloudinary
          }
        );
        mainImageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('Lỗi upload ảnh chính lên Cloudinary:', uploadErr);
        // Decide how to handle upload error: reject request, continue without image, etc.
        // For now, we will log and potentially continue without the main image URL
      }
    }

    // Get step image files info
    const stepImageFiles = uploadedFiles ? uploadedFiles.filter(file => file.fieldname.startsWith('stepImages')) : [];

    // Check required fields
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (title, ingredients, steps)' });
    }
     if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Cần chọn ít nhất 1 danh mục (category) cho món ăn.' });
    }

    console.log(req.user.user_id);

    // Create recipe initially WITHOUT step images to get the _id
    let recipe = await Recipe.create({
      title,
      desc,
      servings,
      cookTime,
      ingredients,
      steps: [], // Initialize with empty steps
      mainImage: mainImageUrl, // Save main image URL
      nutrition,
      status: status || 'draft',
      author: req.user.user_id, // Sử dụng user_id từ payload token
      categories
    });

    const recipeId = recipe._id; // Get the generated _id

    // Process steps and upload step images using the generated recipeId
    const parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps;
    const stepsWithImages = await Promise.all(parsedSteps.map(async (step, stepIndex) => {
        const imagesData = [];
        // Filter step image files belonging to this step based on fieldname
        const filesForThisStep = stepImageFiles.filter(file =>
            // Fieldname is typically stepImages[stepIndex][imageIndex]
            file.fieldname.startsWith(`stepImages[${stepIndex}]`) // Filter by step index
        );

        // Upload step images to Cloudinary using the recipeId
        await Promise.all(filesForThisStep.map(async (file) => {
            try {
                const result = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                    {
                        folder: `recipe_step_images/recipe_${recipeId}/step_${stepIndex}` // Use recipeId here!
                    }
                );
                imagesData.push({
                    url: result.secure_url,
                    // contentType: file.mimetype, // No longer needed based on comments
                });
            } catch (stepUploadErr) {
                 console.error(`Lỗi upload ảnh bước ${stepIndex} lên Cloudinary:`, stepUploadErr);
                 // Handle individual step image upload error if necessary
            }
        }));

        // Return step object with text and populated images array
        return { text: step.text, images: imagesData };
    }));

    // Now, find the recipe again by its id and update it with the stepsWithImages
    // This ensures the _id used for folders is the actual recipe _id
    recipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { $set: { steps: stepsWithImages } },
        { new: true } // Return the updated document
    );

    if (!recipe) {
         // This should ideally not happen, but handle the case where the recipe was somehow not found after creation
         return res.status(404).json({ message: 'Recipe not found after initial creation' });
    }

    // Send the complete recipe object in the response
    res.status(201).json(recipe);

  } catch (err) {
    console.error('Lỗi tạo recipe:', err);
    res.status(500).json({ message: 'Lỗi tạo recipe', error: err.message });
  }
};
exports.getRecipeApproveById = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Validate if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'ID công thức không hợp lệ.' });
    }

    let recipe;

    // If user is admin, fetch recipe regardless of status
    if (req.user && req.user.role === 'admin') {
      recipe = await Recipe.findById(recipeId).populate('author', 'username createdAt');
    } else {
      // For non-authenticated users and regular users, only fetch if status is 'approved'
      recipe = await Recipe.findOne({ _id: recipeId, status: 'approved' })
        .populate('author', 'username createdAt');
    }

    if (!recipe) {
      const message = (req.user && req.user.role === 'admin') 
        ? 'Không tìm thấy recipe.' 
        : 'Không tìm thấy recipe hoặc recipe chưa được duyệt.';
      return res.status(404).json({ message: message });
    }

    res.json(recipe);
  } catch (err) {
    console.error('Lỗi lấy recipe:', err);
    res.status(500).json({ message: 'Lỗi lấy recipe', error: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Validate if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ message: 'ID công thức không hợp lệ.' });
    }

    let recipe;

    // If user is admin, fetch recipe regardless of status
    if (req.user && req.user.role === 'admin') {
      recipe = await Recipe.findById(recipeId).populate('author', 'username createdAt');
    } else {
      // For regular users, only fetch if status is 'approved'
      recipe = await Recipe.findOne({ _id: recipeId, status: 'approved' }).populate('author', 'username createdAt');
    }

    if (!recipe) {
      const message = (req.user && req.user.role === 'admin') ? 'Không tìm thấy recipe.' : 'Không tìm thấy recipe hoặc recipe chưa được duyệt.';
      return res.status(404).json({ message: message });
    }

    res.json(recipe);
  } catch (err) {
    console.error('Lỗi lấy recipe:', err);
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

// Tìm recipe theo nguyên liệu (ingredient)
exports.findByIngredient = async (req, res) => {
  try {
    const keyword = req.query.ingredient;
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ message: 'Thiếu tham số ingredient' });
    }
    // Tìm các recipe có ít nhất 1 nguyên liệu chứa từ khoá (không phân biệt hoa thường)
    const recipes = await Recipe.find({
      status: 'approved',
      ingredients: { $elemMatch: { $regex: keyword, $options: 'i' } }
    }).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tìm recipe theo nguyên liệu', error: err.message });
  }
};

// Tìm kiếm recipe theo title
exports.search = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Thiếu từ khóa tìm kiếm' });
    }
    const recipes = await Recipe.find({
      status: 'approved',
      title: { $regex: q, $options: 'i' }
    }).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tìm kiếm', error: err.message });
  }
};

// lấy tất cả recipe của user
exports.getAllUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.user_id });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy tất cả recipe của user', error: err.message });
  }
};
exports.getPublishedUserRecipes = async (req, res) => {
  try {
    // Find published recipes where the author matches the logged-in user's ID
    const recipes = await Recipe.find({ author: req.user.user_id, status: 'approved' });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get draft recipes for the logged-in user
// @route GET /api/users/me/draft-recipes
// @access Private
exports.getDraftUserRecipes = async (req, res) => {
  try {
    // Find draft recipes where the author matches the logged-in user's ID
    console.log(req.user.user_id);
    const recipes = await Recipe.find({ author: req.user.user_id, status: 'draft' });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a recipe
// @route PUT /api/recipes/:id
// @access Private (Author only)
exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const updates = req.body;
    const userId = req.user.user_id;

    // Khi dùng upload.any(), tất cả file nằm trong req.files (là một mảng phẳng)
    const uploadedFiles = req.files; // Mảng tất cả các file được upload

    // Lấy thông tin file ảnh chính mới từ mảng req.files
    const newMainImageFile = uploadedFiles ? uploadedFiles.find(file => file.fieldname === 'mainImage') : null;
    // const newMainImageBuffer = newMainImageFile ? newMainImageFile.buffer : null; // Dữ liệu nhị phân mới
    // const newMainImageType = newMainImageFile ? newMainImageFile.mimetype : null; // Kiểu MIME mới

    // Lấy thông tin các file ảnh bước làm mới từ mảng req.files
    const newStepImageFiles = uploadedFiles ? uploadedFiles.filter(file => file.fieldname.startsWith('stepImages')) : [];

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Kiểm tra quyền: chỉ tác giả mới được sửa
    if (recipe.author.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa recipe này' });
    }

    // Nếu có ảnh chính mới upload, upload lên Cloudinary và cập nhật URL
    if (newMainImageFile) {
      // Optionally delete the old image from Cloudinary if needed
      // if (recipe.mainImage) {
      //   const publicId = recipe.mainImage.split('/').pop().split('.')[0]; // Extract public ID from URL
      //   await cloudinary.uploader.destroy(`recipe_main_images/${publicId}`);
      // }

      const result = await cloudinary.uploader.upload(
        `data:${newMainImageFile.mimetype};base64,${newMainImageFile.buffer.toString('base64')}`,
        {
          folder: 'recipe_main_images' // Optional: specify a folder in Cloudinary
        }
      );
      recipe.mainImage = result.secure_url;
    }

    // Cập nhật các trường khác từ req.body
    // Có thể cần xử lý đặc biệt cho mảng (ingredients, steps, categories) và object (nutrition)
    // Ví dụ đơn giản: gán trực tiếp (có thể cần refine)
    Object.keys(updates).forEach(key => {
      // Không ghi đè trường mainImage hoặc mainImageType nếu có trong updates (vì đã xử lý file)
      if (key !== 'mainImage' && key !== 'mainImageType' && key !== 'stepImages' && key !== 'steps') { // Bỏ qua cả trường steps
        recipe[key] = updates[key];
      }
    });

    // Đảm bảo trường status chỉ được update nếu người dùng là admin (tùy logic app)
    // Ở đây, ta cho phép tác giả lưu nháp/gửi duyệt lại, nhưng không tự duyệt
    if (updates.status && updates.status !== 'approved') {
      recipe.status = updates.status;
    } else if (updates.status === 'approved' && recipe.status !== 'approved') {
      // Nếu tác giả cố gắng tự duyệt recipe chưa duyệt, có thể báo lỗi hoặc bỏ qua
      // Ở đây, ta bỏ qua việc tác giả tự chuyển sang approved
      // Xóa trường status khỏi updates nếu nó là 'approved' để tác giả không thể tự duyệt
      delete updates.status;
    }
    // Cập nhật các trường sau khi xử lý status đặc biệt
    Object.keys(updates).forEach(key => {
      // Bỏ qua mainImage, mainImageType, stepImages và status
      if (key !== 'mainImage' && key !== 'mainImageType' && key !== 'stepImages' && key !== 'steps' && key !== 'status') { // Bỏ qua cả trường steps
        recipe[key] = updates[key];
      }
    });
    // Cập nhật các mảng và object nested nếu có
    if (updates.ingredients) recipe.ingredients = updates.ingredients;
    // Xử lý cập nhật steps và ảnh bước làm
    if (updates.steps) { // updates.steps chứa text và có thể metadata ảnh từ FE
        // Lặp qua các bước được gửi từ frontend
        const updatedStepsWithImages = await Promise.all(updates.steps.map(async (step, stepIndex) => {
            const imagesData = [];

            // Handle existing images (if frontend sends URLs or identifiers)
            if (step.images) {
                // Assuming step.images contains objects with a 'url' field for existing images
                step.images.forEach(existingImage => {
                    if (existingImage.url) {
                        imagesData.push({ url: existingImage.url });
                    }
                });
            }

            // Filter new files uploaded specifically for this step
            const filesForThisStep = newStepImageFiles.filter(file => 
                file.fieldname.startsWith(`stepImages[${stepIndex}]`)
            );

            // Upload new images for this step to Cloudinary
            await Promise.all(filesForThisStep.map(async (file) => {
                const result = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                    {
                        folder: `recipe_step_images/recipe_${recipeId}/step_${stepIndex}` // Optional: specify a folder
                    }
                );
                imagesData.push({ url: result.secure_url });
            }));
            
            // Trả về object bước làm đã cập nhật (text và mảng ảnh mới + cũ)
            return { text: step.text, images: imagesData };
        }));
        // Cập nhật mảng steps của recipe với dữ liệu mới
        recipe.steps = updatedStepsWithImages;
    }
    if (updates.nutrition) recipe.nutrition = updates.nutrition;
    if (updates.categories) recipe.categories = updates.categories;

    // Lưu recipe đã cập nhật
    const updatedRecipe = await recipe.save();

    res.json(updatedRecipe);

  } catch (err) {
    console.error('Lỗi cập nhật recipe:', err);
    res.status(500).json({ message: 'Lỗi cập nhật recipe', error: err.message });
  }
};

// @desc Delete a recipe
// @route DELETE /api/recipes/:id
// @access Private (Author only)
exports.deleteRecipe = async (req, res) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.user_id;
  
      const recipe = await Recipe.findById(recipeId);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      // Kiểm tra quyền: chỉ tác giả mới được xóa
      if (recipe.author.toString() !== userId) {
        return res.status(403).json({ message: 'Bạn không có quyền xóa recipe này' });
      }
  
      // Tùy chọn: Xóa file ảnh chính trên server nếu cần
      // Cần logic để lấy đường dẫn file trên hệ thống từ recipe.mainImage
      // if (recipe.mainImage && recipe.mainImage !== '/path/to/default/image.jpg') {
      //   const fs = require('fs');
      //   const imagePath = path.join(__dirname, '../public', recipe.mainImage); // Giả định cấu trúc thư mục
      //   fs.unlink(imagePath, (err) => {
      //     if (err) console.error('Lỗi xóa file ảnh cũ:', err);
      //   });
      // }
  
      // Tùy chọn: Xóa ảnh trên Cloudinary khi xóa recipe
      // if (recipe.mainImage) {
      //   const publicId = recipe.mainImage.split('/').pop().split('.')[0];
      //   await cloudinary.uploader.destroy(`recipe_main_images/${publicId}`);
      // }
      // // Also delete step images if stored in specific folders like above
      // for (const step of recipe.steps) {
      //   for (const image of step.images) {
      //     if (image.url) {
      //       // Need logic to extract public ID from step image URL and delete from Cloudinary
      //     }
      //   }
      // }
  
      // Xóa recipe khỏi database
      await recipe.deleteOne();
  
      res.json({ message: 'Recipe đã được xóa' });
  
    } catch (err) {
      console.error('Lỗi xóa recipe:', err);
      res.status(500).json({ message: 'Lỗi xóa recipe', error: err.message });
    }
  };

// Lấy tất cả recipe có trạng thái 'pending' (chờ duyệt)
exports.getPendingRecipes = async (req, res) => {
  try {
    // Chỉ admin mới có thể truy cập
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền xem danh sách chờ duyệt.' });
    }

    const recipes = await Recipe.find({ status: 'pending' })
      .sort({ createdAt: 1 }) // Sắp xếp theo thời gian tạo cũ nhất trước
      .populate('author', 'username');
    
    res.json(recipes);
  } catch (err) {
    console.error('Lỗi lấy danh sách recipe chờ duyệt:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách recipe chờ duyệt', error: err.message });
  }
};

// Lấy tất cả recipe có trạng thái 'pending' (chờ duyệt) của người dùng hiện tại
exports.getUserPendingRecipes = async (req, res) => {
  try {
    // Đảm bảo người dùng đã đăng nhập để lấy user_id
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
    }

    const recipes = await Recipe.find({ author: req.user.user_id, status: 'pending' })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất trước
      .populate('author', 'username createdAt');
    
    res.json(recipes);
  } catch (err) {
    console.error('Lỗi lấy danh sách recipe đang chờ duyệt của người dùng:', err);
    res.status(500).json({ message: 'Lỗi lấy danh sách recipe đang chờ duyệt của người dùng', error: err.message });
  }
};

// Cập nhật trạng thái của một recipe (duyệt/từ chối)
exports.updateRecipeStatus = async (req, res) => {
  try {
    // Chỉ admin mới có thể truy cập
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền cập nhật trạng thái recipe.' });
    }

    const recipeId = req.params.id;
    const { status } = req.body; // Trạng thái mới: 'approved', 'rejected', etc.

    // Kiểm tra trạng thái mới hợp lệ
    const validStatuses = ['approved', 'rejected', 'draft', 'pending']; // Thêm các trạng thái hợp lệ khác nếu có
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Không tìm thấy recipe.' });
    }

    // Cập nhật trạng thái và ngày cập nhật
    recipe.status = status;
    recipe.updatedAt = new Date(); // Cập nhật thời gian chỉnh sửa

    await recipe.save();

    // TODO: Gửi thông báo tới người dùng đã đăng công thức về trạng thái duyệt.
    // Có thể dùng notificationController.createNotification ở đây.

    res.json({ message: `Cập nhật trạng thái recipe thành \'${status}\' thành công.`, recipe });

  } catch (err) {
    console.error('Lỗi cập nhật trạng thái recipe:', err);
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái recipe', error: err.message });
  }
};

// Placeholder function to generate recipe PDF
exports.generateRecipePdf = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Fetch recipe data
    const recipe = await Recipe.findById(recipeId)
      .populate('author', 'username'); // Populate author details

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Construct basic HTML for the PDF
    // This can be made more elaborate to match frontend styling/layout
    let htmlContent = `
      <html>
      <head>
        <title>${recipe.title}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; margin: 20px; color: #333; }
          h1 { color: #0056b3; text-align: center; margin-bottom: 20px; }
          h2 { color: #007bff; margin-top: 25px; margin-bottom: 10px; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
          img { max-width: 100%; height: auto; display: block; margin: 10px auto; border: 1px solid #ddd; padding: 5px; }
          .section { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
          ul, ol { margin-left: 20px; padding-left: 0; }
          li { margin-bottom: 8px; padding-left: 10px; border-left: 3px solid #007bff; }
          p { margin-bottom: 10px; }
          strong { color: #555; }
          .user-info { margin-bottom: 15px; font-style: italic; color: #666; }
          .ingredients li, .steps li { border-left-color: #28a745; }
          .steps li { border-left-color: #dc3545; }
        </style>
      </head>
      <body>
        <h1>${recipe.title}</h1>
        <p class="user-info"><strong>Author:</strong> ${recipe.author ? recipe.author.username : 'N/A'}</p>
        <p><strong>Description:</strong> ${recipe.desc || 'N/A'}</p>
        <p><strong>Cook Time:</strong> ${recipe.cookTime || 'N/A'}</p>

        ${recipe.mainImage ? `<div style="text-align: center;"><img src="${recipe.mainImage}" alt="Main Recipe Image" style="max-width: 80%; margin: 20px auto;"/></div>` : ''}

        <div class="section ingredients">
          <h2>Ingredients</h2>
          ${recipe.ingredients && recipe.ingredients.length > 0
            ? `<ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>`
            : '<p>No ingredients listed.</p>'}
        </div>

        ${recipe.servings ? `
          <div class="section">
            <h2>Servings</h2>
            <p>${recipe.servings}</p>
          </div>
        ` : ''}

        <div class="section steps">
          <h2>Steps</h2>
          ${recipe.steps && recipe.steps.length > 0
            ? `<ol>${recipe.steps.map((step, index) => `
              <li>
                ${step.text || ''}
                ${step.images && step.images.length > 0 
                  ? step.images.map(img => `<img src="${img.url}" alt="Step Image ${index + 1}"/>`).join('') 
                  : ''}
              </li>
            `).join('')}</ol>`
            : '<p>No steps listed.</p>'}
        </div>

         ${recipe.nutrition ? `
          <div class="section">
            <h2>Nutrition</h2>
             <p>${recipe.nutrition}</p>
          </div>
         ` : ''}

      </body>
      </html>
    `;

    // PDF generation options (optional)
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      // You might need to configurephantomPath for your system
      // phantomPath: '/usr/local/bin/phantomjs' 
    };

    // Generate PDF
    pdf.create(htmlContent, options).toStream((err, stream) => {
      if (err) {
        console.error('Error creating PDF:', err);
        return res.status(500).json({ message: 'Failed to generate PDF.', error: err.message });
      }

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      
      // Sanitize the recipe title for the filename
      const sanitizedTitle = (recipe.title || 'recipe').replace(/[^a-zA-Z0-9_\-]/g, '_');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}.pdf"`);

      // Pipe the PDF stream to the response
      stream.pipe(res);
    });

  } catch (err) {
    console.error('Error generating recipe PDF:', err);
    res.status(500).json({ message: 'Failed to generate recipe PDF', error: err.message });
  }
};

