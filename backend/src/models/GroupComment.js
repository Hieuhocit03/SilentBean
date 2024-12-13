const mongoose = require("mongoose");

const groupCommentSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupCard",
    required: true,
  }, // ID của bộ thẻ mà bình luận thuộc về
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Người bình luận
  content: {
    type: String,
    required: true,
  }, // Nội dung bình luận
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Thời gian tạo bình luận
});

module.exports = mongoose.model("Comment", groupCommentSchema);
