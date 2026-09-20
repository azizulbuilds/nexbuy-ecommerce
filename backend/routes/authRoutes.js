const express = require("express");

const {
  registerUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  loginUser,
  getProfile,
  logoutUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Registration
router.post("/register", registerUser);

// Email verification
router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

// Password recovery
router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Protected profile
router.get("/profile", protect, getProfile);

module.exports = router;