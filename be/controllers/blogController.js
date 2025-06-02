const Blog = require('../models/Blog');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer để lưu trữ trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images', // Thư mục trên Cloudinary để lưu ảnh blog
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Middleware để upload ảnh chính cho blog
exports.uploadBlogImage = upload.single('image'); // Tên field trong form-data phải là 'image'

// Tạo blog mới
exports.createBlog = async (req, res) => {
  try {
    // Lấy dữ liệu từ req.body (các trường text)
    const { title, desc, content, tags, sections, quote } = req.body; // Thêm quote
    console.log(req.body);

    // Lấy URL ảnh từ req.file (sau khi upload bằng multer)
    const imageUrl = req.file ? req.file.path : null;

    // Parse tags và sections (chúng sẽ là string nếu gửi qua form-data)
    const parsedTags = tags ? JSON.parse(tags) : [];
    const parsedSections = sections ? JSON.parse(sections) : [];
    // Parse quote (có thể là string rỗng)

    // Lấy thông tin user từ req.user (giả sử đã xác thực)
    const user = await User.findById(req.user.user_id); // Sử dụng user_id từ payload token
    if (!user) {
      // Nếu có ảnh đã upload lên Cloudinary mà không tìm thấy user, xóa ảnh đó
      if (imageUrl) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Kiểm tra vai trò người dùng
    if (user.role !== 'admin') {
       // Nếu có ảnh đã upload lên Cloudinary mà không phải admin, xóa ảnh đó
      if (imageUrl) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(403).json({ message: 'Chỉ admin mới có quyền tạo blog' });
    }

    // Tạo blog mới với URL ảnh đã upload
    const blog = await Blog.create({
      title,
      desc,
      content,
      image: imageUrl, // Lưu URL ảnh từ Cloudinary
      tags: parsedTags,
      sections: parsedSections,
      quote, // Lưu trường quote
      author: user._id,
      authorName: user.fullName || user.username,
      authorAvatar: user.avatar,
      createdAt: new Date(), // Đảm bảo có createdAt
      updatedAt: new Date() // Thêm updatedAt
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error('Lỗi tạo blog:', err);
     // Nếu có lỗi xảy ra sau khi upload ảnh lên Cloudinary, xóa ảnh đó
    if (req.file && req.file.filename) {
       try {
          await cloudinary.uploader.destroy(req.file.filename);
          console.log('Uploaded image deleted from Cloudinary due to error.');
       } catch (deleteErr) {
          console.error('Error deleting uploaded image from Cloudinary:', deleteErr);
       }
    }
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