require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const https = require("https");
const fs = require("fs");
const { Server } = require("socket.io");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const connectDB = require("./config/db");

// Import Passport configuration
require("./config/passport")(passport);

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");
const blogRoutes = require("./routes/blog");
const savedRecipeRoutes = require("./routes/savedRecipe");
const commentRoutes = require("./routes/comment");
const paymentRoutes = require("./routes/payment");
const transactionRoutes = require("./routes/transactionRoutes");
const notificationRoutes = require("./routes/notification");
const chatgptRoutes = require("./routes/chatgpt");
const aiRoutes = require("./routes/ai");
const menuRoutes = require("./routes/menuRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const adminRoutes = require("./routes/admin");

// ... (các route khác nếu cần)

const app = express();

// Passport and Session middleware
// Session middleware must be configured before Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
const corsOptions = {
  origin: ["https://exe-web-cooking.vercel.app", "https://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware for Stripe webhooks - MUST be before express.json()
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Đường dẫn đến thư mục upload
const uploadDir = path.join(__dirname, "public/uploads/recipes");

// Kiểm tra và tạo thư mục upload nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Thư mục upload created: ${uploadDir}`);
  } catch (err) {
    console.error(`Lỗi tạo thư mục upload ${uploadDir}:`, err);
  }
} else {
  console.log(`Thư mục upload already exists: ${uploadDir}`);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/saved-recipes", savedRecipeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chatgpt", chatgptRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);

// ... (các route khác nếu cần)

app.get("/", (req, res) => res.send("API is running!"));

// Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 4567;

const sslOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

const httpsServer = https.createServer(sslOptions, app);
const io = new Server(httpsServer, {
  cors: {
    origin: [
      "https://exe-web-cooking.vercel.app",
      "https://exe-web-cooking.vercel.app",
      "https://localhost:3000"
    ],
    credentials: true,
  },
});
app.set("io", io);
global.io = io;

// Connect to MongoDB

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Socket.io connection
io.on("connection", (socket) => {
  // Nhận userId khi client connect
  socket.on("register", (userId) => {
    socket.join(userId);
  });
});
