const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"], // Validation: Bắt buộc phải có
      trim: true, // Loại bỏ khoảng trắng thừa
      minlength: [1, "Title must be at least 1 characters"], // Tối thiểu 3 ký tự
      maxlength: [200, "Title cannot exceed 200 characters"], // Tối đa 200 ký tự
      index: true, // Tạo chỉ mục
    },
    description: {
      type: String,
      required: [true, "Description is required"], // Validation: Bắt buộc phải có
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"], // Tối đa 500 ký tự
    },
    tags: {
      type: mongoose.Schema.Types.ObjectId, // Thay vì chuỗi, sử dụng ObjectId
      ref: "Tag", // Liên kết tới bảng Tag
      required: [true, "Tag ID is required"], // Validation: Tag bắt buộc phải có
    },
    cards: [
      {
        question: {
          type: String,
          required: [true, "Question is required"], // Validation: Bắt buộc phải có
          trim: true,
          minlength: [1, "Question must be at least 1 characters"], // Tối thiểu 5 ký tự
          maxlength: [300, "Question cannot exceed 300 characters"], // Tối đa 300 ký tự
        },
        answer: {
          type: String,
          required: [true, "Answer is required"], // Validation: Bắt buộc phải có
          trim: true,
          minlength: [1, "Answer must be at least 1 character"], // Tối thiểu 1 ký tự
          maxlength: [500, "Answer cannot exceed 500 characters"], // Tối đa 500 ký tự
        },
        image: {
          type: String,
          default: null,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết tới User model
      required: [true, "User ID is required"], // Validation: Bắt buộc phải có
      index: true, // Tạo chỉ mục để tìm kiếm
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo chỉ mục để tìm kiếm theo userId và title
CardSchema.index({ userId: 1, title: 1 });

module.exports = mongoose.model("Card", CardSchema);
