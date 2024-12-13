// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Đăng nhập admin
router.post("/login", adminController.login);

// Tạo admin mới (chỉ dùng trong giai đoạn setup, sau này nên xóa route này)
router.post("/create", adminController.createAdmin);

router.get("/users", adminController.getAllUsers);

router.post("/users", adminController.createUser);

router.delete("/users/:id", adminController.deleteUser);

router.put("/users/:id", adminController.updateUser);

router.get("/stats", adminController.getStats);

router.get("/me", adminController.getAdminInfo);

router.put("/admin/:id", adminController.updateAdmin);

router.delete("/admin/:id", adminController.deleteAdmin);

router.get("/adminlist", adminController.getAllAdmin);

module.exports = router;
