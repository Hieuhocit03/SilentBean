// controllers/adminController.js
const Admin = require("../models/Admin");
const User = require("../models/User");
const Group = require("../models/Group");
const Card = require("../models/Cards");
const Challenge = require("../models/Challenge");
const Favorite = require("../models/FavoriteCard");
const GroupCard = require("../models/GroupCard");
const GroupComment = require("../models/GroupComment");
const GroupMembers = require("../models/GroupMember");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng nhập admin
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(404).json({ message: "Admin không tồn tại!" });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // Tạo JWT token
    const token = jwt.sign({ id: admin._id, role: "admin" }, "secretKey", {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ token, adminId: admin._id, usernameAD: admin.username });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// Tạo admin mới (chỉ dành cho dev trong giai đoạn setup)
exports.createAdmin = async (req, res) => {
  const { username, password, fullname, role } = req.body;

  // Kiểm tra nếu không có trường fullname hoặc role
  if (!fullname || !role) {
    return res.status(400).json({ message: "Fullname and role are required" });
  }

  try {
    // Kiểm tra nếu role không phải là admin hoặc support
    if (!["admin", "support"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be 'admin' or 'support'" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Tạo mới admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      fullname,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
};

exports.getAdminInfo = async (req, res) => {
  try {
    // Giả sử adminId được lấy từ token (middleware xác thực) hoặc truyền từ request
    const adminId = req.headers["x-admin-id"]; // Middleware xác thực sẽ thêm userId vào req
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID không được cung cấp" });
    }

    // Tìm Admin dựa trên ID
    const admin = await Admin.findById(adminId, { password: 0 }); // Không trả về password
    if (!admin) {
      return res.status(404).json({ message: "Admin không tồn tại" });
    }

    // Trả về thông tin admin
    res.status(200).json({
      success: true,
      username: admin.username,
      role: admin.role,
      fullname: admin.fullname,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin admin:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thông tin admin",
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { username, password, fullname, role } = req.body;

    const updateData = { username, fullname, role };
    if (password && password.trim() !== "") {
      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword; // Gán lại mật khẩu đã mã hóa vào req.body
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({ success: true, admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating admin" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id; // Lấy ID từ tham số route

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID không được cung cấp" });
    }

    // Tìm và xóa Admin
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin không tồn tại" });
    }

    res.status(200).json({ message: "Admin đã bị xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa Admin:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi xóa Admin" });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find(); // Lấy tất cả admin từ DB
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ success: false, message: "Error fetching admins" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Lấy tất cả người dùng, sắp xếp theo ngày tạo mới nhất
    const users = await User.find()
      .select("email username dateOfBirth createdAt updatedAt") // Lấy các trường cần thiết
      .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo ngày tạo

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
      error,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, username, dateOfBirth } = req.body;

    // Kiểm tra nếu email hoặc username đã tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email hoặc username đã tồn tại." });
    }

    const salt = await bcrypt.genSalt(10); // Tạo salt với độ phức tạp 10
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      dateOfBirth,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      data: newUser,
      message: "Thêm người dùng thành công.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi thêm người dùng.", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, dateOfBirth, password } = req.body;

    // Tạo object chứa dữ liệu cần cập nhật
    const updateData = { email, username, dateOfBirth };

    // Nếu có mật khẩu mới, thêm vào dữ liệu cập nhật
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Cập nhật người dùng
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại." });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Cập nhật người dùng thành công.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi cập nhật người dùng.", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa người dùng
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại." });
    }

    await Card.deleteMany({ userId: id });
    const deletedCards = await Card.find({ userId: id });
    const deletedCardIds = deletedCards.map((card) => card._id);
    await Group.updateMany(
      { cards: { $in: deletedCardIds } }, // Tìm group chứa các ID bộ thẻ đã xóa
      { $pull: { cards: { $in: deletedCardIds } } } // Xóa ID các bộ thẻ khỏi danh sách cards trong group
    );
    await Challenge.deleteMany({ userId: id });
    await Favorite.deleteMany({ userId: id });
    await Group.deleteMany({
      userId: id,
    });
    await Group.updateMany(
      { members: id }, // Điều kiện: group có chứa id trong mảng members
      { $pull: { members: id } } // Hành động: xóa id khỏi mảng members
    );
    await GroupCard.deleteMany({ userId: id });
    await GroupComment.deleteMany({ userId: id });
    await GroupMembers.deleteMany({ userId: id });

    res
      .status(200)
      .json({ success: true, message: "Xóa người dùng thành công." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi xóa người dùng.", error });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const groupCount = await Group.countDocuments();
    const cardsCount = await Card.countDocuments();

    const mostActiveUser = await User.aggregate([
      {
        $lookup: {
          from: "cards", // Từ bộ thẻ
          localField: "_id", // Liên kết với userId trong bảng cards
          foreignField: "userId", // Liên kết với userId trong bảng cards
          as: "userCards", // Lưu bộ thẻ của người dùng
        },
      },
      {
        $addFields: {
          cardCount: { $size: "$userCards" }, // Thêm trường cardCount để đếm số bộ thẻ
        },
      },
      {
        $sort: { cardCount: -1 }, // Sắp xếp theo số bộ thẻ giảm dần
      },
      { $limit: 1 }, // Lấy người dùng có nhiều bộ thẻ nhất
    ]);

    const mostActiveGroup = await Group.aggregate([
      {
        $lookup: {
          from: "cards", // Liên kết với bộ thẻ
          localField: "_id", // Liên kết với groupId trong bảng cards
          foreignField: "groupId", // Liên kết với groupId trong bảng cards
          as: "groupFlashcards", // Lưu bộ thẻ của nhóm
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: "$groupFlashcards" }, // Đếm số bộ thẻ trong nhóm
          memberCount: { $size: "$members" }, // Đếm số lượng thành viên trong nhóm
        },
      },
      {
        $sort: {
          flashcardCount: -1, // Sắp xếp theo số lượng bộ thẻ giảm dần
          memberCount: -1, // Nếu số bộ thẻ bằng nhau, sắp xếp theo số lượng thành viên
        },
      },
      { $limit: 1 }, // Lấy nhóm hoạt động nổi bật nhất
    ]);

    const mostUsedTags = await Card.aggregate([
      {
        $unwind: "$tags", // Tách các tag từ mảng tags
      },
      {
        $group: {
          _id: "$tags", // Nhóm theo tag
          count: { $sum: 1 }, // Đếm số lần tag xuất hiện
        },
      },
      {
        $lookup: {
          from: "tags", // Liên kết với bảng tags để lấy tên tag
          localField: "_id",
          foreignField: "_id",
          as: "tagDetails",
        },
      },
      {
        $unwind: "$tagDetails", // Tách thông tin tag
      },
      {
        $project: {
          tagName: "$tagDetails.name", // Lấy tên tag
          count: 1, // Số lần tag xuất hiện
        },
      },
      {
        $sort: { count: -1 }, // Sắp xếp theo số lần tag xuất hiện
      },
      { $limit: 3 }, // Lấy 5 tag sử dụng nhiều nhất
    ]);

    res.json({
      stats: {
        users: userCount,
        groups: groupCount,
        flashcards: cardsCount,
      },
      mostActiveUser: mostActiveUser[0] || null, // Trả về người dùng tích cực nhất
      mostActiveGroup: mostActiveGroup[0] || null, // Trả về nhóm hoạt động nổi bật nhất
      mostUsedTags: mostUsedTags,
    });
  } catch (err) {
    res.status(500).send("Lỗi khi lấy dữ liệu thống kê");
  }
};
