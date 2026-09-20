const express = require("express");

const {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getMyOrderById,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// Create Order
// ==========================================

router.post("/", protect, createOrder);

// ==========================================
// Create Razorpay Payment Order
// ==========================================

router.post(
  "/:id/payment",
  protect,
  createRazorpayOrder
);

// ==========================================
// Verify Razorpay Payment
// ==========================================

router.post(
  "/payment/verify",
  protect,
  verifyRazorpayPayment
);

// ==========================================
// Get My Orders
// ==========================================

router.get("/", protect, getMyOrders);

// ==========================================
// Get Single My Order
// ==========================================

router.get("/:id", protect, getMyOrderById);

module.exports = router;