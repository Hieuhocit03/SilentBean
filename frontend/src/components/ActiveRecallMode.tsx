import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Flashcard = () => {
  const { _id } = useParams();
  const [card, setCard] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/card/${_id}`
        );
        setCard(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching card:", error);
        setLoading(false);
      }
    };
    if (_id) {
      fetchCard();
    }
  }, [_id]);

  const handleSubmit = () => {
    const correctAnswer = card.cards[currentIndex].answer;
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setRevealAnswer(true);
      setFeedback({ type: "success", message: "Chính xác! 🎉" });
    } else {
      setAttempts((prev) => prev + 1);
      if (attempts + 1 >= 3) {
        setRevealAnswer(true);
        setFeedback({
          type: "error",
          message: "Đã hết số lần thử. Hãy xem đáp án đúng nhé!",
        });
      } else {
        setFeedback({
          type: "error",
          message: `Sai rồi! Còn ${2 - attempts} lần thử.`,
        });
      }
    }
  };

  const handleNext = () => {
    setRevealAnswer(false);
    setAttempts(0);
    setUserAnswer("");
    setFeedback({ type: null, message: "" });
    setCurrentIndex((prev) => (prev + 1 < card.cards.length ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#75A47F]/10 to-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-lg"
        >
          <div className="h-5 w-5 animate-spin rounded-full border-3 border-[#75A47F] border-t-transparent"></div>
          <span className="text-base font-medium text-[#75A47F]">
            Đang tải...
          </span>
        </motion.div>
      </div>
    );
  }

  if (!card) return null;

  const progress = ((currentIndex + 1) / card.cards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#75A47F]/10 to-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <Header
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "hidden" : "block"
        }`}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold text-[#75A47F]">
            Tiêu đề: {card.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-4 rounded-xl bg-white p-3 shadow-lg"
        >
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-[#75A47F]">
              Câu hỏi {currentIndex + 1}/{card.cards.length}
            </span>
            <span className="text-gray-600">
              {Math.round(progress)}% hoàn thành
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-[#75A47F]"
            ></motion.div>
          </div>
        </motion.div>

        <motion.div
          layout
          className="overflow-hidden rounded-xl bg-white shadow-xl"
        >
          <div className="p-6">
            <div className="mb-6">
              {card.cards[currentIndex].image && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-4 overflow-hidden rounded-lg bg-gray-50"
                >
                  <img
                    src={card.cards[currentIndex].image}
                    alt="Question"
                    className="h-[300px] w-full object-contain"
                  />
                </motion.div>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {card.cards[currentIndex].question}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {!revealAnswer ? (
                <motion.div
                  key="input"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-base transition-all focus:border-[#75A47F] focus:outline-none focus:ring-2 focus:ring-[#75A47F]/20"
                    placeholder="Nhập đáp án của bạn..."
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full rounded-lg bg-[#75A47F] py-2 text-base font-medium text-white transition-all hover:bg-[#75A47F]/90 hover:shadow-md focus:ring-2 focus:ring-[#75A47F] focus:ring-offset-2"
                  >
                    Kiểm tra
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="answer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="rounded-lg bg-[#75A47F]/10 p-4">
                    <p className="text-base font-medium text-[#75A47F]">
                      Đáp án đúng:{" "}
                      <span className="text-lg font-bold">
                        {card.cards[currentIndex].answer}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full rounded-lg bg-[#75A47F] py-2 text-base font-medium text-white transition-all hover:bg-[#75A47F]/90 hover:shadow-md focus:ring-2 focus:ring-[#75A47F] focus:ring-offset-2"
                  >
                    Câu tiếp theo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {feedback.type && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`border-t ${
                  feedback.type === "success"
                    ? "bg-[#75A47F]/10 text-[#75A47F]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <p className="p-3 text-center text-base font-medium">
                  {feedback.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="p-3">
          <button
            onClick={() => navigate(`/card/${card._id}`)}
            className="bg-[#75A47F] w-20 h-10 text-center text-white rounded-lg hover:bg-[#75A47F]/90 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
