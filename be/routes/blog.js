const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middlewares/auth');

// Corrected route for creating blog with file upload
// Original: router.post('/create', auth, blogController.createBlog);
// New: Use endpoint '/' and include uploadBlogImage middleware
router.post('/', auth, blogController.uploadBlogImage, blogController.createBlog);

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Route for updating a blog (requires auth and image upload middleware)
router.put('/:id', auth, blogController.uploadBlogImage, blogController.updateBlog);

// Route for deleting a blog (requires auth middleware)
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router;