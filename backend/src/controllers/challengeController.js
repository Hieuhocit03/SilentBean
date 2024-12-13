const Challenge = require("../models/Challenge");
const Card = require("../models/Cards");
const User = require("../models/User");
const mongoose = require("mongoose");
const nodeCron = require("node-cron");

// API để ghi nhận thời gian khi người dùng trả lời câu hỏi
exports.recordChallenge = async (req, res) => {
  const { userId, timeTaken } = req.body;
  const { cardSetId, questionId } = req.params;

  try {
    // Kiểm tra nếu bộ thẻ tồn tại
    const cardSet = await Card.findById(cardSetId);
    if (!cardSet) {
      return res.status(404).json({ message: "Card Set not found" });
    }

    // Tìm câu hỏi trong bộ thẻ
    const question = cardSet.cards.find(
      (card) => card._id.toString() === questionId
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Lưu thời gian trả lời của người dùng
    const challenge = new Challenge({
      userId,
      cardSetId,
      questionId,
      timeTaken,
    });

    await challenge.save();

    // Trả về câu trả lời đúng của câu hỏi
    res.status(200).json({
      message: "Challenge recorded successfully",
      correctAnswer: question.answer, // Trả về câu trả lời đúng
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// API để tính toán bảng xếp hạng dựa trên tổng thời gian
exports.getLeaderboard = async (req, res) => {
  const { cardSetId } = req.params;

  try {
    const challenges = await Challenge.aggregate([
      { $match: { cardSetId: new mongoose.Types.ObjectId(cardSetId) } },
      {
        $group: {
          _id: "$userId",
          totalTime: { $sum: "$timeTaken" },
        },
      },
      { $sort: { totalTime: 1 } }, // Sắp xếp theo thời gian hoàn thành
      { $limit: 10 }, // Hiển thị top 10 người chơi
    ]);

    const leaderboard = await Promise.all(
      challenges.map(async (challenge) => {
        const user = await User.findById(challenge._id);
        return {
          username: user.username,
          totalTime: challenge.totalTime,
        };
      })
    );

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

nodeCron.schedule("0 0 * * *", async () => {
  console.log("Running daily leaderboard reset task...");
  try {
    await Challenge.deleteMany({});
    console.log("Leaderboard reset completed.");
  } catch (err) {
    console.error("Failed to reset leaderboard:", err);
  }
});
