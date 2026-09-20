const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// Public Routes
// ==========================================

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// ==========================================
// Admin Routes
// ==========================================

// Create product with optional image
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createProduct
);

// Update product with optional image
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);

module.exports = router;