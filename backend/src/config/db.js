// backend/src/config/db.js
const mongoose = require("mongoose");
const dbURI = "mongodb://localhost:27017/SilentBean"; // Địa chỉ kết nối MongoDB (có thể thay bằng MongoDB Atlas URI)

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
