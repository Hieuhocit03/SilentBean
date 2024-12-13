const Tag = require("../models/Tags"); // Import model (giả định bạn có một model Tag)

// Tạo một tag mới
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra nếu tên tag đã tồn tại
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ message: "Tag đã tồn tại." });
    }

    const newTag = await Tag.create({ name });
    res.status(201).json({
      message: "Tạo tag thành công!",
      data: newTag,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy danh sách tất cả các tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({
      message: "Danh sách tags:",
      data: tags,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa một tag cụ thể
exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      return res.status(404).json({ message: "Tag không tồn tại." });
    }

    res.status(200).json({
      message: "Xóa tag thành công!",
      data: deletedTag,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa tất cả các tags
exports.deleteAllTags = async (req, res) => {
  try {
    await Tag.deleteMany();
    res.status(200).json({ message: "Đã xóa tất cả tags!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateTag = async (req, res) => {
  // Lấy thông tin name mới từ body request

  try {
    const tagId = req.params.id; // Lấy ID tag từ tham số URL
    const { name } = req.body;
    // Tìm tag theo ID và cập nhật thông tin
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { name }, // Chỉ cập nhật trường name
      { new: true, runValidators: true } // new: true trả về tag đã cập nhật; runValidators để kiểm tra validation của Mongoose
    );

    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Trả về kết quả sau khi cập nhật
    res.status(200).json({ message: "Tag updated successfully", updatedTag });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating tag", error: error.message });
  }
};
