// server.js
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cardRoutes = require("./routes/cardRoutes");
const tagRoutes = require("./routes/tagRoutes");
const groupRoutes = require("./routes/groupRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use(express.json({ limit: "50mb" }));

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyDmxAtQc6QQZPg_ue1nzVdYiA0uY_A2Yqg"; // Thay bằng API Key của bạn
const genAI = new GoogleGenerativeAI(apiKey);

require("dotenv").config();
require("./cronJobs/cleanInvalidCards");

connectDB();

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json()); // Parse JSON request body
app.use(cors());
// Sử dụng route
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);

app.post("/generate-flashcards", async (req, res) => {
  const { prompt } = req.body;
  const fixedPrompt = `
    ${prompt.trim()}
    Mỗi thẻ sẽ có một câu hỏi và câu trả lời tương ứng. 
    Chỉ trả về danh sách các câu hỏi và câu trả lời dưới dạng: 
    - Câu hỏi: [Câu hỏi]
    - Câu trả lời: [Câu trả lời]

    Không cần in ra bất kỳ mô tả, tiêu đề hay phần giới thiệu nào. 
    Đảm bảo mỗi câu hỏi và câu trả lời có định dạng rõ ràng và đầy đủ.
  `;

  try {
    // Chọn mô hình và gọi API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fixedPrompt);

    const flashcardsText = result.response.text();

    return res.status(200).json({
      success: true,
      data: flashcardsText.split("\n"),
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate content",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
