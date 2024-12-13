const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const Card = require("../models/Cards");
const GroupCard = require("../models/GroupCard");
const Comment = require("../models/GroupComment");

// Tạo group mới
exports.createGroup = async (req, res) => {
  try {
    const { name, description, userId } = req.body;

    const newGroup = new Group({
      name: name,
      description: description,
      userId: userId,
    });
    await newGroup.save();

    // Thêm người tạo vào danh sách thành viên với vai trò admin
    const newMember = new GroupMember({
      userId: userId,
      groupId: newGroup._id,
      role: "admin",
    });
    await newMember.save();

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Lấy danh sách các group mà người dùng tham gia
exports.getUserGroups = async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm tất cả các nhóm mà người dùng là thành viên
    const userGroups = await GroupMember.find({ userId }).populate("groupId");

    // Phân loại nhóm: "Created Groups" và "Joined Groups"
    const createdGroups = [];
    const joinedGroups = [];

    userGroups.forEach((groupMember) => {
      if (groupMember.role === "admin") {
        createdGroups.push(groupMember.groupId); // Người dùng là admin => Nhóm được tạo
      } else {
        joinedGroups.push(groupMember.groupId); // Người dùng là thành viên => Nhóm tham gia
      }
    });
    // Trả về 2 danh sách
    res.status(200).json({
      created: createdGroups, // Nhóm do người dùng tạo
      joined: joinedGroups, // Nhóm người dùng tham gia
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

exports.getGroupDetail = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Lấy thông tin nhóm và admin của nhóm
    const group = await Group.findById(groupId).populate("userId", "username"); // Populate admin thông qua userId

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Lấy danh sách thành viên của nhóm từ GroupMember model
    const members = await GroupMember.find({ groupId })
      .populate("userId", "username") // Populate thông tin user
      .select("userId role joinedAt"); // Lấy các trường cần thiết

    // Lấy danh sách bộ flashcard trong nhóm
    const flashcards = await Card.find({ groupId });

    // Tính tổng số thành viên trong nhóm
    const memberCount = members.length;

    // Trả về dữ liệu
    res.status(200).json({
      group: {
        ...group.toObject(), // Chuyển đổi group object thành plain object
        memberCount, // Thêm thông tin số lượng thành viên
        members: members.map((member) => ({
          username: member.userId?.username,
          email: member.userId?.email,
          role: member.role,
          joinedAt: member.joinedAt,
        })),
      },
      flashcards,
    });
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ error: "Failed to fetch group details" });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const { search } = req.query; // Lấy từ khóa tìm kiếm từ query

    let query = {};
    if (search) {
      // Tìm kiếm nhóm theo tên có chứa từ khóa
      query = { name: { $regex: search, $options: "i" } };
    }

    const groups = await Group.find(query).select("name description createdAt");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Thêm thành viên vào group
exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params; // ID của nhóm
    const { userId } = req.body; // ID của người dùng từ token xác thực

    // Kiểm tra xem người dùng đã là thành viên hay chưa
    const existingMember = await GroupMember.findOne({ userId, groupId });
    if (existingMember) {
      return res
        .status(400)
        .json({ message: "Bạn đã là thành viên của nhóm này." });
    }
    // Thêm người dùng vào nhóm
    const newMember = new GroupMember({
      userId,
      groupId,
      role: "member", // Vai trò mặc định là "member"
    });
    await newMember.save();

    const group = await Group.findById(groupId); // Lấy nhóm
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Thêm userId vào trường members
    group.members.push(userId);

    // Lưu lại nhóm sau khi cập nhật
    await group.save();

    res.status(200).json({ message: "Successfully joined the group." });
  } catch (error) {
    res.status(500).json({ error: "Failed to join the group." });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params; // ID nhóm
    const { userId } = req.body; // ID người dùng từ request body hoặc token

    // Kiểm tra xem nhóm có tồn tại không
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Kiểm tra xem người dùng có phải là thành viên của nhóm không
    const groupMember = await GroupMember.findOne({ userId, groupId });
    if (!groupMember) {
      return res
        .status(400)
        .json({ message: "Bạn không phải là thành viên của nhóm này." });
    }

    // Xóa thành viên khỏi nhóm
    await GroupMember.deleteOne({ userId, groupId });

    // Cập nhật danh sách thành viên của nhóm
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    await group.save();

    res.status(200).json({ message: "Đã rời khỏi nhóm thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to leave the group." });
  }
};

exports.addFlashcardToGroup = async (req, res) => {
  try {
    const { groupId, cardId, userId } = req.body;

    const groupFlashcard = new GroupCard({
      groupId,
      cardId,
      userId,
      status: "Pending", // Chờ duyệt
    });

    await groupFlashcard.save();
    res.status(201).json({ message: "Flashcard submitted for approval." });
  } catch (error) {
    console.error("Error adding flashcard to group:", error);
    res.status(500).json({ message: "Failed to add flashcard to group." });
  }
};

exports.getApprovedFlashcards = async (req, res) => {
  try {
    const { groupId } = req.params;

    const flashcards = await GroupCard.find({ groupId, status: "Approved" })
      .populate("cardId", "name description cards") // Populate flashcard info
      .populate("userId", "username"); // Populate user info

    res.status(200).json(flashcards);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    res.status(500).json({ message: "Failed to fetch flashcards for group." });
  }
};

exports.getPendingFlashcards = async (req, res) => {
  try {
    const { groupId } = req.params;

    const pendingFlashcards = await GroupCard.find({
      groupId,
      status: "Pending",
    })
      .populate("cardId", "name description cards") // Populate flashcard info
      .populate("userId", "username"); // Populate user info

    res.status(200).json(pendingFlashcards);
  } catch (error) {
    console.error("Error fetching pending flashcards:", error);
    res.status(500).json({ message: "Failed to fetch pending flashcards." });
  }
};

exports.approveFlashcard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const flashcard = await GroupCard.findById(cardId);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found." });
    }

    flashcard.status = "Approved"; // Duyệt bài
    await flashcard.save();

    const group = await Group.findOne({ _id: flashcard.groupId }); // Giả sử flashcard chứa groupId
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // Thêm cardId vào danh sách flashcards của group
    group.flashcards.push(flashcard.cardId); // Hoặc trường tương tự trong nhóm
    await group.save();

    res
      .status(200)
      .json({ message: "Thẻ ghi nhớ đã được chấp thuận thành công." });
  } catch (error) {
    console.error("Error approving flashcard:", error);
    res.status(500).json({ message: "Failed to approve flashcard." });
  }
};

exports.rejectFlashcard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const flashcard = await GroupCard.findById(cardId);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found." });
    }

    await flashcard.deleteOne(); // Xóa bài đăng

    res
      .status(200)
      .json({ message: "Thẻ ghi nhớ đã bị từ chối và xóa thành công." });
  } catch (error) {
    console.error("Error rejecting flashcard:", error);
    res.status(500).json({ message: "Failed to reject flashcard." });
  }
};

exports.getGroupCard = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const groupCards = await GroupCard.find({ groupId: groupId })
      .populate("userId", "username email") // Chỉ lấy trường `username` từ user
      .exec(); // Giả sử bạn dùng Mongoose để lấy dữ liệu
    res.json(groupCards);
  } catch (error) {
    console.error("Error fetching groupcards:", error);
    res.status(500).send("Server error");
  }
};

exports.deleteFlashcard = async (req, res) => {
  const { cardId } = req.params; // ID của bộ thẻ
  const userId = req.headers["x-user-id"]; // ID của người dùng từ JWT (middleware xác thực)

  try {
    // Tìm bộ thẻ theo ID
    const flashcard = await GroupCard.findById(cardId);

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    // Kiểm tra nếu người yêu cầu xóa không phải là người đăng
    if (flashcard.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this flashcard" });
    }

    // Xóa bộ thẻ
    await GroupCard.deleteOne({ _id: cardId });
    await Group.updateOne(
      { _id: flashcard.groupId }, // Tìm group chứa flashcard
      { $pull: { flashcards: flashcard.cardId } } // Loại bỏ cardId khỏi mảng flashcards
    );

    res.status(200).json({ message: "Bộ thẻ ghi nhớ đã được xóa thành công" });
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addComment = async (req, res) => {
  const { cardId } = req.params;
  const { content } = req.body;
  const userId = req.headers["x-user-id"]; // ID của người dùng từ middleware xác thực

  try {
    // Tạo một bình luận mới
    const newComment = new Comment({
      cardId,
      userId,
      content,
    });

    await newComment.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommentsByCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const comments = await Comment.find({ cardId })
      .populate({
        path: "userId", // Trường liên kết tới bảng User
        select: "username", // Lấy trường username từ bảng User
      })
      .exec();

    const card = await Card.findById(cardId).populate({
      path: "userId", // Lấy thông tin người tạo bộ thẻ
      select: "username", // Lấy trường username từ bảng User
    });
    res.status(200).json({ comments, cardCreator: card.userId.username });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.headers["x-user-id"];

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Kiểm tra nếu người xóa không phải là người đã đăng bình luận
    if (comment.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.deleteOne({ _id: commentId });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateGroup = async (req, res) => {
  const { groupId } = req.params; // Lấy groupId từ params
  const { name, description } = req.body; // Lấy name và description từ request body

  try {
    // Tìm và cập nhật group bằng groupId
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId, // Tìm nhóm theo ID
      { name, description }, // Cập nhật name và description
      { new: true, runValidators: true } // Thực hiện các validator và trả về bản ghi đã cập nhật
    );

    // Nếu không tìm thấy group
    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Trả về kết quả cập nhật
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params; // Lấy groupId từ params

  try {
    // Kiểm tra nhóm có tồn tại hay không
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Xóa tất cả thành viên trong nhóm
    await GroupMember.deleteMany({ groupId });

    // Xóa tất cả flashcards liên kết với nhóm
    await GroupCard.deleteMany({ groupId });

    // Xóa nhóm
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Nhóm đã được xóa thành công." });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Server error" });
  }
};
