const express = require("express");

const {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, admin);

// Get all orders
router.get("/orders", getAllOrders);

// Get single order
router.get("/orders/:id", getAdminOrderById);

// Update order status
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;