const express = require("express");
const {
  createGroup,
  getUserGroups,
  getGroupDetail,
  getAllGroups,
  joinGroup,
  leaveGroup,
  addFlashcardToGroup,
  getApprovedFlashcards,
  getPendingFlashcards,
  approveFlashcard,
  rejectFlashcard,
  getGroupCard,
  deleteFlashcard,
  addComment,
  getCommentsByCard,
  deleteComment,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/create", createGroup); // Tạo group
router.get("/:userId", getUserGroups); // Lấy danh sách group người dùng tham gia
router.get("/g/:groupId", getGroupDetail); // Lấy thông tin chi tiết nhóm
router.get("/", getAllGroups);
router.post("/:groupId/join", joinGroup);
router.post("/:groupId/leave", leaveGroup);
router.post("/add", addFlashcardToGroup);
router.get("/:groupId/approved", getApprovedFlashcards);
router.get("/:groupId/pending", getPendingFlashcards);
router.put("/:cardId/approve", approveFlashcard);
router.delete("/:cardId/reject", rejectFlashcard);
router.get("/c/:groupId", getGroupCard);
router.delete("/:cardId", deleteFlashcard);
router.post("/:cardId/comment", addComment);
router.get("/:cardId/comments", getCommentsByCard);
router.delete("/comment/:commentId", deleteComment);
router.put("/:groupId", updateGroup);
router.delete("/group/:groupId", deleteGroup);

module.exports = router;
