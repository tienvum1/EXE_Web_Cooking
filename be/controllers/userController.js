const User = require('../models/User');
const Recipe = require('../models/Recipe');
const bcrypt = require("bcryptjs"); // Import bcrypt
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user', error: err.message });
  }
};

// Lấy thông tin user theo id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user', error: err.message });
  }
};

// Lấy thông tin user và các món ăn của user đó
exports.getUserWithRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    const recipes = await Recipe.find({ author: user._id, status: 'approved' })
      .select('title mainImage cookTime status type desc');
    res.json({ ...user.toObject(), recipes });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thông tin user và recipes', error: err.message });
  }
};

// @desc    Follow or unfollow a user
// @route   POST /api/users/:userId/follow
// @access  Private (Authenticated users only)
exports.followUnfollowUser = async (req, res) => {
  try {
    const userIdToFollow = req.params.userId; // The ID of the user being followed/unfolloweder
    // The authenticated user's ID is available on req.user (set by auth middleware)
    // Assuming req.user.user_id holds the user ID from the token payload
    const currentUserId = req.user.user_id; 

    // Find both users
    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    // Check if users exist
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent a user from following themselves
    if (userIdToFollow.toString() === currentUserId.toString()) {
        return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    // Check if the current user is already following the target user
    // Assuming 'following' and 'followers' are arrays of user IDs in your User model
    const isFollowing = currentUser.following.includes(userIdToFollow);

    if (isFollowing) {
      // If already following, unfollow
      // Remove userIdToFollow from currentUser's following array
      currentUser.following.pull(userIdToFollow);
      // Remove currentUserId from userToFollow's followers array
      userToFollow.followers.pull(currentUserId);
      await currentUser.save();
      await userToFollow.save();
      res.json({ message: 'Hủy theo dõi thành công.' });
    } else {
      // If not following, follow
      // Add userIdToFollow to currentUser's following array
      currentUser.following.push(userIdToFollow);
      // Add currentUserId to userToFollow's followers array
      userToFollow.followers.push(currentUserId);
      await currentUser.save();
      await userToFollow.save();
      res.json({ message: 'Theo dõi thành công!' });
    }

  } catch (error) {
    console.error('Error in followUnfollowUser:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (Authenticated users only)
exports.updateUserProfile = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const currentUserId = req.user.user_id; // Assuming auth middleware sets this

    // Check if the authenticated user is the same as the user being updated
    if (userIdToUpdate.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa thông tin của người dùng này.' });
    }

    const updates = req.body; // Data from the frontend form

    // Prevent updating sensitive fields directly if needed (e.g., role, password)
    const allowedUpdates = ['fullName', 'bio', 'introduce']; // Specify fields allowed to be updated
    const actualUpdates = Object.keys(updates);
    const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Các trường thông tin không hợp lệ để cập nhật.' });
    }

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    // Apply updates
    actualUpdates.forEach((update) => user[update] = updates[update]);

    await user.save();

    // Optionally, re-fetch the user after saving to return the latest data
    const updatedUser = await User.findById(userIdToUpdate).select('-password_hash');

    res.json(updatedUser); // Send back the updated user data

  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.user_id; // Get user ID from authenticated request

  try {
    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      // This case should not happen with auth middleware, but good practice
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    // Check if user has a password set (not a Google-only user without a password)
    if (!user.password_hash) {
        return res.status(400).json({ message: 'Bạn chưa thiết lập mật khẩu. Vui lòng sử dụng tính năng đặt lại mật khẩu hoặc thiết lập mật khẩu lần đầu.' });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' });
    }

    // Validate new password (basic check, more can be added)
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and save
    user.password_hash = hashedPassword;
    await user.save();

    res.json({ message: 'Mật khẩu đã được thay đổi thành công.' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thay đổi mật khẩu.' });
  }
};

// gửi mail 
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: "Email không tồn tại" }); // Không tiết lộ email tồn tại

    // Tạo token reset password (JWT, expires in 15m)
    const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Link reset password
    const resetLink = `${process.env.CLIENT_ORIGIN}/reset-password?token=${resetToken}`;

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Đặt lại mật khẩu Fitmeal",
      html: `<p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào <a href="${resetLink}">đây</a> để đặt lại mật khẩu. Link này sẽ hết hạn sau 15 phút.</p>`,
    });

    res.json({ message: "Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Lỗi server khi gửi email." });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log(token, password);
  if (!token || !password)
    return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc user không tồn tại" });

    // Đổi mật khẩu
    user.password_hash = await bcrypt.hash(password, 10);
    await user.save();

    res.json({
      message:
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};
