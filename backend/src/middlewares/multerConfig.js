// multerConfig.js
const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Chỉ định thư mục lưu trữ file
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Đổi tên file thành thời gian hiện tại + tên gốc để tránh trùng
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Cấu hình multer với các điều kiện, giới hạn dung lượng, loại file,...
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file tối đa là 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận ảnh, ví dụ PNG, JPG, JPEG
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
  },
});

module.exports = upload;
