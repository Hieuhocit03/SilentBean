const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      unique: true, // Tên tag phải duy nhất
      minlength: [1, "Tag name must be at least 1 characters"],
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", TagSchema);
