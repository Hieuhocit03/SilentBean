const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true }, // Thêm trường fullname
  role: {
    type: String,
    enum: ["admin", "support"], // Chỉ chấp nhận giá trị 'admin' hoặc 'support'
    required: true,
    default: "support", // Đặt giá trị mặc định là 'support'
  },
});

module.exports = mongoose.model("Admin", adminSchema);
