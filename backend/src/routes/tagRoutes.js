const express = require("express");
const tagController = require("../controllers/tagController");

const router = express.Router();

// Tạo tag mới
router.post("/", tagController.createTag);

// Lấy danh sách tất cả tags
router.get("/", tagController.getAllTags);

// Xóa một tag cụ thể
router.delete("/:id", tagController.deleteTag);

// Xóa tất cả các tags
router.delete("/", tagController.deleteAllTags);

router.put("/update/:id", tagController.updateTag);

module.exports = router;
