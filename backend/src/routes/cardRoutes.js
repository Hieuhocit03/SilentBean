const express = require("express");
const {
  createNewDeck,
  getAllDecks,
  getCardById,
  updateDeck,
  deleteDeck,
  searchFlashcards,
} = require("../controllers/cardController");

const router = express.Router();

// Route tạo bộ thẻ mới
router.post("/", createNewDeck);
router.get("/:userId", getAllDecks);
router.get("/card/:_id", getCardById);
router.put("/:_id", updateDeck);
router.delete("/:id", deleteDeck);
router.get("/c/search", searchFlashcards);

module.exports = router;
