const mongoose = require("mongoose");

const groupCardSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Liên kết với collection Group
      required: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cards", // Liên kết với collection Flashcard
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với collection User (người tạo bài đăng)
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"], // Trạng thái bộ thẻ
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Tự động lưu thời gian tạo
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model("GroupCard", groupCardSchema);
