const FavoriteCard = require("../models/FavoriteCard");
const Card = require("../models/Cards");

// Thêm bộ thẻ yêu thích
exports.addFavorite = async (req, res) => {
  const { userId, cardId } = req.body;

  try {
    // Kiểm tra xem đã tồn tại chưa
    const existingFavorite = await FavoriteCard.findOne({ userId, cardId });

    if (existingFavorite) {
      return res.status(400).json({ message: "Card is already favorited" });
    }

    const favorite = new FavoriteCard({ userId, cardId });
    await favorite.save();

    res.status(201).json({ message: "Card added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ message: "Failed to add favorite", error });
  }
};

// Xoá bộ thẻ yêu thích
exports.removeFavorite = async (req, res) => {
  const { userId, cardId } = req.body;

  try {
    const favorite = await FavoriteCard.findOneAndDelete({ userId, cardId });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.status(200).json({ message: "Card removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite", error });
  }
};

exports.getFavoriteDecks = async (req, res) => {
  const { userId } = req.params;
  try {
    const favorites = await FavoriteCard.find({ userId }).select("cardId");
    const cardIds = favorites.map((fav) => fav.cardId);

    // Lấy thông tin chi tiết của các bộ thẻ
    const favoriteCards = await Card.find({ _id: { $in: cardIds } });

    res.status(200).json(favoriteCards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorite cards" });
  }
};
