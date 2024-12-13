// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login); // Route đăng nhập
router.post("/register", authController.register); // Route
router.get("/:id", authController.getUserProfile); // Lấy thông tin cá nhân
router.put("/:id", authController.updateUserProfile);
router.post("/check-email", authController.checkEmail);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
