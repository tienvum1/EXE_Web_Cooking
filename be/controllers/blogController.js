const Blog = require('../models/Blog');
const User = require('../models/User');

// Tạo blog mới
exports.createBlog = async (req, res) => {
  try {
    const { title, desc, content, image, tags, sections } = req.body;
    // Lấy thông tin user từ req.user (giả sử đã xác thực)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const blog = await Blog.create({
      title,
      desc,
      content,
      image,
      tags,
      sections,
      author: user._id,
      authorName: user.fullName || user.username,
      authorAvatar: user.avatar
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo blog', error: err.message });
  }
};

// Lấy tất cả blog
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách blog', error: err.message });
  }
};

// Lấy chi tiết blog theo id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select('-__v');
    if (!blog) return res.status(404).json({ message: 'Không tìm thấy blog' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết blog', error: err.message });
  }
}; 