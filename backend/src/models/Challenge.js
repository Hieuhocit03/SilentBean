const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardSetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card.cards", // Liên kết đến câu hỏi trong bộ thẻ
      required: true,
    },
    timeTaken: {
      type: Number, // Thời gian trả lời (giây)
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
