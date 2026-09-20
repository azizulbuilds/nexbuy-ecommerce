const dns = require("dns");

// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ==========================================
// Load Environment Variables FIRST
// ==========================================
dotenv.config();

// ==========================================
// Database
// ==========================================
const connectDB = require("./config/db");

// ==========================================
// Routes
// ==========================================
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==========================================
// Connect Database
// ==========================================
connectDB();

const app = express();

// ==========================================
// Allowed Frontend Origins
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: Origin ${origin} is not allowed`)
      );
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// ==========================================
// Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "MERN E-Commerce API is running",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});