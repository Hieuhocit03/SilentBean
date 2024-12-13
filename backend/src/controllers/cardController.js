const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Card = require("../models/Cards");
const Group = require("../models/Group");
const GroupCard = require("../models/GroupCard");
const GroupComment = require("../models/GroupComment");
const Challenge = require("../models/Challenge");
const Favorite = require("../models/FavoriteCard");
const upload = require("../middlewares/multerConfig");
// Tạo bộ thẻ mới
exports.createNewDeck = async (req, res) => {
  try {
    upload.array("image", 10)(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error uploading files", error: err.message });
      }

      let { title, description, tags, userId, cards } = req.body;

      cards = JSON.parse(cards);

      if (
        !title ||
        !description ||
        !tags ||
        !cards ||
        cards.length === 0 ||
        !userId
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const processedCards = cards.map((card, index) => ({
        question: card.question,
        answer: card.answer,
        image: req.files[index]
          ? `${req.protocol}://${req.get("host")}/uploads/${
              req.files[index].filename
            }`
          : null, // Lấy đường dẫn ảnh từ multer
      }));

      const newDeck = new Card({
        title,
        description,
        tags,
        cards: processedCards,
        userId,
      });

      await newDeck.save();

      res.status(201).json({
        message: "Deck created successfully",
        deck: newDeck,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllDecks = async (req, res) => {
  const { userId } = req.params;
  try {
    const decks = await Card.find({ userId }); // Lấy tất cả bộ thẻ từ database
    return res.status(200).json({
      success: true,
      data: decks, // Trả về danh sách các bộ thẻ
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bộ thẻ:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách bộ thẻ.",
    });
  }
};

exports.getCardById = async (req, res) => {
  try {
    const cardId = req.params._id;

    const card = await Card.findById(cardId).populate("tags");

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bộ thẻ với ID đã cho.", // Nếu không tìm thấy bộ thẻ
      });
    }
    // Trả về bộ thẻ với thông tin chi tiết
    return res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error("Lỗi khi lấy bộ thẻ:", error);

    // Trả về lỗi server nếu có sự cố
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy bộ thẻ. Vui lòng thử lại sau.",
    });
  }
};
exports.updateDeck = async (req, res) => {
  // Sử dụng multer để upload ảnh
  upload.array("image", 10)(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading files", error: err.message });
    }

    const { title, description, tags, cards } = req.body;

    try {
      // Parse JSON của cards
      const parsedCards = JSON.parse(cards);

      // Tìm bộ thẻ theo ID
      const existingDeck = await Card.findById(req.params._id);
      if (!existingDeck) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bộ thẻ để cập nhật.",
        });
      }

      // Khởi tạo dữ liệu cập nhật
      const updatedData = {};

      // Cập nhật các trường cơ bản nếu thay đổi
      if (title && title !== existingDeck.title) {
        updatedData.title = title;
      }
      if (description && description !== existingDeck.description) {
        updatedData.description = description;
      }
      if (tags && tags !== existingDeck.tags) {
        updatedData.tags = tags;
      }

      // Cập nhật từng card
      if (parsedCards) {
        const updatedCards = parsedCards.map((card, index) => {
          const existingCard = existingDeck.cards[index] || {};

          return {
            question: card.question || existingCard.question,
            answer: card.answer || existingCard.answer,
            image: req.files[index]
              ? `${req.protocol}://${req.get("host")}/uploads/${
                  req.files[index].filename
                }` // File mới được upload
              : existingCard.image, // File cũ nếu không upload mới
          };
        });
        updatedData.cards = updatedCards;
      }

      // Thêm thời gian cập nhật
      updatedData.updatedAt = Date.now();

      // Thực hiện cập nhật bộ thẻ
      const updatedDeck = await Card.findByIdAndUpdate(
        req.params._id, // ID bộ thẻ từ params
        updatedData,
        { new: true } // Trả về dữ liệu mới sau khi cập nhật
      );

      // Kiểm tra nếu không tìm thấy bộ thẻ
      if (!updatedDeck) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bộ thẻ để cập nhật.",
        });
      }

      // Trả về dữ liệu bộ thẻ đã cập nhật
      return res.status(200).json({
        success: true,
        data: updatedDeck,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật bộ thẻ:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật bộ thẻ.",
      });
    }
  });
};

exports.deleteDeck = async (req, res) => {
  const { id } = req.params; // Lấy ID của bộ thẻ từ URL

  try {
    // Tìm và xóa bộ thẻ trong cơ sở dữ liệu
    const deletedDeck = await Card.findByIdAndDelete(id);

    // Nếu không tìm thấy bộ thẻ, trả về lỗi
    if (!deletedDeck) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bộ thẻ.",
      });
    }

    await Challenge.deleteMany({ cardSetId: id });
    await Favorite.deleteMany({ cardId: id });
    await Group.deleteMany({ flashcards: id });
    await GroupCard.deleteMany({ cardId: id });
    await GroupComment.deleteMany({ cardId: id });

    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      message: "Xóa bộ thẻ thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa bộ thẻ:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa bộ thẻ.",
    });
  }
};

exports.searchFlashcards = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const flashcards = await Card.find({
      title: { $regex: keyword, $options: "i" }, // Tìm kiếm theo title (không phân biệt hoa thường)
    }).exec();
    res.status(200).json({ flashcards });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
