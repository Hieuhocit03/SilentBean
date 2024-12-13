// controllers/authController.js
const User = require("../models/User"); // Model người dùng
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");

const router = express.Router();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.endsWith("@gmail.com")) {
      return res
        .status(400)
        .json({ msg: "Email phải là tài khoản @gmail.com!" });
    }

    // Kiểm tra người dùng trong DB
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ msg: "Email sai! Vui lòng nhập lại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu sai! Vui lòng nhập lại!" });
    }

    // Tạo JWT token
    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, username, dateOfBirth } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ msg: "Vui lòng điền đầy đủ thông tin bắt buộc" });
    }

    if (!email.endsWith("@gmail.com")) {
      return res
        .status(400)
        .json({ msg: "Email phải là tài khoản @gmail.com!" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email đã được sử dụng" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username đã được sử dụng" });
    }

    if (!dateOfBirth) {
      return res.status(400).json({ msg: "Ngày sinh không được bỏ trống" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ phức tạp 10
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      dateOfBirth,
    });

    await newUser.save();
    res.status(201).json({
      msg: "Đăng ký thành công",
      user: { email, username, dateOfBirth },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id); // Không trả về mật khẩu
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật thông tin cá nhân
exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { email, password, username, dateOfBirth } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Kiểm tra xem mật khẩu có thay đổi không
    let updatedData = { email, username, dateOfBirth };

    if (password) {
      // Nếu mật khẩu thay đổi, mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword; // Cập nhật mật khẩu đã mã hóa
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm kiếm người dùng dựa vào email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    return res.status(200).json({ message: "Email hợp lệ" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Kiểm tra xem email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặc biệt",
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};
