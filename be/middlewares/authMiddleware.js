const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

// Modified middleware to protect the setPassword route
exports.protectSetPassword = async (req, res, next) => {
  let token;

  // 1. Check for token in cookies (primary)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    // console.log("Token found in cookie:", token); // Keep for debugging if needed
  }

  // 2. Fallback: Query parameter (less likely now but kept for robustness)
  if (!token && req.query.token) {
    token = req.query.token;
    // console.log("Token found in query parameter (fallback):", token); // Keep for debugging if needed
  }

  // 3. Fallback: Authorization header (Bearer token)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("Token found in Authorization header (fallback):", token); // Keep for debugging if needed
  }

  if (!token) {
    console.error(
      "ProtectSetPassword: No token found in cookie, query, or header. Rejecting request."
    );
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // console.log("Attempting to verify token:", token); // Keep for debugging if needed
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("ProtectSetPassword: Token verified successfully:", decoded); // Keep for debugging if needed
    
    // *** Gắn user_id vào req object với tên khác để tránh ghi đè req.user ***
    req.authenticatedUserId = decoded.user_id;
    // console.log(
    //   "ProtectSetPassword: Attached authenticatedUserId:",
    //   req.authenticatedUserId
    // ); // Keep for debugging if needed

    next();
  } catch (error) {
    console.error(
      "ProtectSetPassword: Token verification failed:",
      error.message
    );
    if (req.cookies && req.cookies.token) {
      // Only clear cookie if the token came from cookie
      res.clearCookie("token");
      console.log("ProtectSetPassword: Cleared invalid cookie.");
    }
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Standard protection middleware
exports.protect = async (req, res, next) => {
  let token;
  // Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header (Bearer token)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user object to request
    req.user = await User.findById(decoded.user_id).select('-password_hash'); // Exclude password hash

    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Optional: Check if the user changed password after the token was issued
    // if (user.passwordChangedAfter(decoded.iat)) { ... }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to check for admin role (optional, but good practice)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this route` });
        }
        next();
    };
}; 