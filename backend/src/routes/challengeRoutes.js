const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");

// API để ghi nhận thời gian khi người dùng trả lời câu hỏi
router.post("/:cardSetId/:questionId", challengeController.recordChallenge);

// API để lấy bảng xếp hạng
router.get("/leaderboard/:cardSetId", challengeController.getLeaderboard);

module.exports = router;
