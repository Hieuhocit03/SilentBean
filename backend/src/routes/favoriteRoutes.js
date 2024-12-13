const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getFavoriteDecks,
} = require("../controllers/favoriteController");

const router = express.Router();

router.post("/add", addFavorite); // Thêm vào yêu thích
router.post("/remove", removeFavorite); // Xoá khỏi yêu thích
router.get("/favorites/:userId", getFavoriteDecks);

module.exports = router;
