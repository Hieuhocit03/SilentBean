const mongoose = require("mongoose");

const FavoriteCardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Đảm bảo mỗi user chỉ có thể yêu thích một bộ thẻ duy nhất
FavoriteCardSchema.index({ userId: 1, cardId: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteCard", FavoriteCardSchema);
