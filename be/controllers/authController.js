const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require("validator");
const User = require("../models/User");
const dotenv = require("dotenv");
const Wallet = require("../models/Wallet");
dotenv.config();
const passport = require("passport"); // Import passport here
const crypto = require("crypto"); // Import crypto module

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cooking";
const JWT_SECRET = process.env.JWT_SECRET || "tienvu123";

// Helper function to generate JWT token and set cookie
const generateTokenAndSetCookie = (user, res) => {
  // Explicitly use asynchronous sign with callback
  console.log("user trong generateTokenAndSetCookie", user);
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user_id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.error("JWT signing error:", err);
          return reject(err);
        }
        console.log("JWT Token:", token); // Thêm log ở đây

        // Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          secure: true, // ✅ Bắt buộc phải true nếu dùng HTTPS
          sameSite: "None", // ✅ Cho phép gửi cookie cross-site giữa Vercel FE và Render BE
          path: "/",
          // ✅ KHÔNG cần set domain nếu để backend tự xử lý. Nếu muốn:
          // domain: ".onrender.com", // nếu backend chạy ở onrender
        });

        resolve(token);
      }
    );
  });
};

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: email.split("@")[0],
      fullName: name,
      email,
      password_hash: hashedPassword,
      phone,
      is_verified: false,
      role: "user",
      loginMethods: ["password"],
    });

    await user.save();

    // Tạo wallet mới với số dư 0 cho user
    const wallet = new Wallet({
      user: user._id,
      balance: 0,
    });
    await wallet.save();

    const emailToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verificationUrl = `https://exe-web-cooking.vercel.app/verify-email?token=${emailToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Verify your FitMeal account",
      html: `<p>Cảm ơn bạn đã đăng ký FitMeal! Vui lòng nhấp vào liên kết sau để xác minh địa chỉ email của bạn:</p><p><a href="${verificationUrl}">Xác minh Email</a></p><p>Liên kết này sẽ hết hạn sau 1 ngày.</p>`,
    });

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác minh.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đăng ký." });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("Backend: Verify Email endpoint hit with token:", token); // Log when endpoint is hit
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Backend: Verify Email - Token decoded successfully:", decoded);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.user_id,
      { isActive: true },
      { new: true }
    );
    console.log("Backend: Verify Email - User updated:", updatedUser);

    if (!updatedUser) {
      console.error(
        "Error: User not found for verification ID:",
        decoded.user_id
      );
      return res
        .status(400)
        .json({ message: "Token xác minh không hợp lệ hoặc đã hết hạn." });
    }

    console.log(
      "Backend: Verify Email - Redirecting to login page via CLIENT_ORIGIN:",
      process.env.CLIENT_ORIGIN
    );
    res.redirect(`${process.env.CLIENT_ORIGIN}`);
  } catch (err) {
    console.error("Error during email verification:", err.message);
    res
      .status(400)
      .json({ message: "Token xác minh không hợp lệ hoặc đã hết hạn." });
    console.log(
      "Backend: Verify Email - Redirecting to login page on error via CLIENT_ORIGIN:",
      process.env.CLIENT_ORIGIN
    );
    res.redirect(`${process.env.CLIENT_ORIGIN}/login?verificationError=true`);
  }
};

// LOGIN (Email/Password)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(" email và pass đăng nhập");
  console.log(email, password);
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log("user tim thay sau đăng nhâp ", user);
    // Check if user exists and if password login is enabled for this account
    if (!user || !user.loginMethods.includes("password")) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified (optional based on your flow, but good practice)
    if (!user.isActive)
      return res.status(400).json({ message: "Please verify your email" });

    // Check if password matches (only if password_hash exists)
    if (
      !user.password_hash ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and set cookie
    const token = await generateTokenAndSetCookie(user, res);

    res.status(200).json({
      message: "Logged in successfully",
      token: token,
      user: {
        user_id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
        // Có thể trả về loginMethods nếu client cần biết
        // loginMethods: user.loginMethods,
      },
    });
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);

    // Simplified error handling for production to prevent leaking info
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình đăng nhập." });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  console.log("Logout endpoint hit");
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Must match login setting (use true for local HTTPS)
    sameSite: "Lax",
    path: "/",
    domain: "localhost", // *** Explicitly set domain to match setting ***
  });
  res.json({ message: "Đăng xuất thành công" });
};

// GOOGLE LOGIN (Initiate OAuth flow)
exports.googleLogin = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
};

// GOOGLE LOGIN CALLBACK (Handle the callback from Google)
exports.googleCallback = async (req, res) => {
  if (!req.user) {
    console.error(
      "Google authentication failed - req.user is null after passport strategy"
    );
    return res.redirect(
      `${process.env.CLIENT_ORIGIN}/login?error=google_auth_failed`
    );
  }

  try {
    const user = req.user;
    // Await the asynchronous token generation and cookie setting
    await generateTokenAndSetCookie(user, res);
    const redirectUrl = `${process.env.CLIENT_ORIGIN}`;
    console.log("Redirecting Google authenticated user to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error in googleCallback after passport auth:", err);
    res.redirect(
      `${process.env.CLIENT_ORIGIN}/login?error=google_auth_failed_server`
    );
  }
};

// Set password for a user (e.g., after Google login for a user without password_hash)
(exports.setPassword = [
  (req, res, next) => {
    next();
  },
  async (req, res) => {
    const { password } = req.body;
    const userId = req.authenticatedUserId;

    if (!userId) {
      console.error(
        "setPassword handler: authenticatedUserId not found in req after middleware."
      );
      return res
        .status(401)
        .json({ message: "Authentication failed, user ID missing" });
    }

    if (!password) {
      return res.status(400).json({ message: "Mật khẩu là bắt buộc." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        console.error(
          `setPassword handler: User not found with ID from token: ${userId}`
        );
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password_hash = hashedPassword;

      if (!user.loginMethods.includes("password")) {
        user.loginMethods.push("password");
      }
      user.isActive = true; // Có thể cần kích hoạt tài khoản sau khi đặt mật khẩu nếu ban đầu không active

      await user.save();

      res.json({ message: "Mật khẩu đã được thiết lập thành công." });
    } catch (error) {
      console.error("Error setting password:", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi thiết lập mật khẩu." });
    }
  },
]),
  // Get logged-in user profile
  (exports.getMe = async (req, res) => {
    // req.user contains payload from token (user_id, role)
    if (!req.user || !req.user.user_id) {
      return res
        .status(401)
        .json({ message: "Không tìm thấy thông tin người dùng." });
    }
    console.log("user id ", req.user.user_id);

    try {
      // Find the full user document in the database
      const user = await User.findById(req.user.user_id).select(
        "-password_hash"
      ); // Exclude password hash

      if (!user) {
        // This case should ideally not happen if token is valid, but good to handle
        return res.status(404).json({
          message: "Không tìm thấy thông tin người dùng trong database.",
        });
      }

      // Return the full user data (excluding password_hash)
      res.status(200).json(user);
      console.log("Backend: getMe sending user data:", user); // Log the user data being sent
    } catch (error) {
      console.error("Error fetching user data in getMe:", error);
      res
        .status(500)
        .json({ message: "Đã xảy ra lỗi khi lấy thông tin người dùng." });
    }
  });

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Return a generic success message to prevent email enumeration
      return res.json({
        message:
          "Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email đó.",
      });
    }

    // 2. Generate a unique token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 3. Hash the token and save to user (store hashed token in DB for security)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // 4. Send email to user with reset link (use the unhashed token in the link)
    const transporter = nodemailer.createTransport({
      service: "gmail", // Or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `
        <p>Bạn nhận được email này vì bạn (hoặc người khác) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấp vào liên kết sau, hoặc dán liên kết này vào trình duyệt của bạn để hoàn tất quá trình:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message:
        "Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email đó.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu quên mật khẩu." });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // 1. Hash the token from the URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user by hashed token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }

    // 3. Validate the new password
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    // 4. Hash the new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password_hash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isActive = true; // Ensure account is active after password reset

    await user.save();

    res.json({ message: "Mật khẩu của bạn đã được đặt lại thành công." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đặt lại mật khẩu." });
  }
};
