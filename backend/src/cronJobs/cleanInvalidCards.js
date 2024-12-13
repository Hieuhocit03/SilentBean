const cron = require("node-cron");
const Card = require("../models/Cards"); // Đảm bảo đường dẫn chính xác đến models của bạn
const Group = require("../models/Group");

// Hàm dọn dẹp
async function cleanInvalidCardReferences() {
  try {
    // Tìm tất cả ID bộ thẻ hợp lệ
    const validCardIds = (await Card.find({}, { _id: 1 })).map(
      (card) => card._id
    );

    // Xóa các tham chiếu không hợp lệ trong group
    await Group.updateMany(
      { flashcards: { $nin: validCardIds } },
      { $pull: { flashcards: { $nin: validCardIds } } }
    );

    console.log("Cron Job: Cleaned up invalid card references successfully.");
  } catch (error) {
    console.error(
      "Cron Job Error: Failed to clean invalid card references.",
      error
    );
  }
}

// Lên lịch chạy mỗi ngày lúc 2 giờ sáng
cron.schedule("0 * * * *", cleanInvalidCardReferences);

module.exports = { cleanInvalidCardReferences };
