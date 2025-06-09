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

// Cập nhật blog
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const updates = req.body;
    const userId = req.user.user_id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy blog.' });
    }

    // Kiểm tra quyền: Chỉ admin hoặc tác giả blog mới có quyền sửa
    if (req.user.role !== 'admin' && blog.author.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa blog này.' });
    }

    // Xử lý upload ảnh mới nếu có
    let imageUrl = blog.image; // Giữ nguyên ảnh cũ mặc định
    if (req.file) {
      // Nếu có ảnh cũ trên Cloudinary, xóa nó đi
      if (blog.image) {
        // Cần trích xuất public_id từ URL Cloudinary
        const publicId = blog.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`blog_images/${publicId}`); // Xóa ảnh cũ
      }
      imageUrl = req.file.path; // Lấy URL ảnh mới từ Cloudinary
    }

    // Cập nhật các trường của blog
    blog.title = updates.title || blog.title;
    blog.desc = updates.desc || blog.desc;
    blog.content = updates.content || blog.content;
    blog.image = imageUrl; // Cập nhật ảnh
    blog.quote = updates.quote || blog.quote; // Cập nhật quote
    blog.updatedAt = new Date(); // Cập nhật thời gian chỉnh sửa

    // Xử lý tags và sections nếu có trong updates
    if (updates.tags) {
      blog.tags = JSON.parse(updates.tags);
    }
    if (updates.sections) {
      blog.sections = JSON.parse(updates.sections);
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);

  } catch (err) {
    console.error('Lỗi cập nhật blog:', err);
    res.status(500).json({ message: 'Lỗi cập nhật blog', error: err.message });
  }
};

// Xóa blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.user_id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy blog.' });
    }

    // Kiểm tra quyền: Chỉ admin hoặc tác giả blog mới có quyền xóa
    if (req.user.role !== 'admin' && blog.author.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa blog này.' });
    }

    // Xóa ảnh của blog trên Cloudinary nếu có
    if (blog.image) {
      const publicId = blog.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`blog_images/${publicId}`);
    }

    await blog.deleteOne();
    res.json({ message: 'Blog đã được xóa thành công.' });

  } catch (err) {
    console.error('Lỗi xóa blog:', err);
    res.status(500).json({ message: 'Lỗi xóa blog', error: err.message });
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