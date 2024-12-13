import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ChallengeModeProps {
  cardSetId: string;
}

const ChallengeMode: React.FC<ChallengeModeProps> = ({ cardSetId }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number>(0);
  const [challengeStarted, setChallengeStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/card/${cardSetId}`
        );
        setCards(response.data.data.cards || []);
        console.log(response.data.data.cards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cardSetId) {
      fetchCards();
    }
  }, [cardSetId]);

  const handleStartChallenge = () => {
    setStartTime(Date.now());
    setChallengeStarted(true);
  };

  const handleSubmitAnswer = async () => {
    if (!startTime) return;

    const currentCard = cards[currentCardIndex];
    const correctAnswer = currentCard.answer.trim().toLowerCase();

    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setEndTime(Date.now());
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const userId = localStorage.getItem("userId");

      try {
        await axios.post(
          `http://localhost:5000/api/challenge/${cardSetId}/${currentCard._id}`,
          {
            userId,
            timeTaken,
          }
        );

        if (currentCardIndex + 1 < cards.length) {
          setCurrentCardIndex(currentCardIndex + 1);
          setUserAnswer("");
          setStartTime(Date.now());
          setShowAnswer(false);
        } else {
          setChallengeCompleted(true);
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    } else {
      setShowAnswer(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#75A47F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden">
      {!challengeStarted ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sẵn sàng thử thách bản thân chưa?
            </h2>
            <p className="text-gray-600 mb-6">
              Kiểm tra kiến ​​thức của bạn và cạnh tranh với những người khác
              trong chế độ thử thách tính giờ này!
            </p>
            <button
              onClick={handleStartChallenge}
              className="bg-[#75A47F] text-white px-8 py-3 rounded-lg
                hover:bg-[#588561] active:bg-[#486E4E]
                transition-all duration-200 shadow-lg hover:shadow-xl
                focus:outline-none focus:ring-2 focus:ring-[#75A47F]/50
                transform hover:scale-105"
            >
              Bắt đầu thử thách!
            </button>
          </div>
        </div>
      ) : cards.length > 0 &&
        currentCardIndex < cards.length &&
        !challengeCompleted ? (
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-gray-500">
                Câu hỏi {currentCardIndex + 1} of {cards.length}
              </span>
              <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#75A47F] transition-all duration-300"
                  style={{
                    width: `${((currentCardIndex + 1) / cards.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {cards[currentCardIndex].question}
            </h1>

            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                placeholder="Câu trả lời của bạn..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                  focus:ring-2 focus:ring-[#75A47F]/50 focus:border-[#75A47F]
                  transition-all duration-200 outline-none"
              />

              {showAnswer && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <p className="text-red-700">
                    Sai! Câu trả lời đúng là:{" "}
                    <span className="font-semibold">
                      {cards[currentCardIndex].answer}
                    </span>
                  </p>
                </div>
              )}
              <button
                onClick={handleSubmitAnswer}
                className="w-full bg-[#75A47F] text-white px-6 py-3 rounded-lg
                  hover:bg-[#588561] active:bg-[#486E4E]
                  transition-all duration-200 shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-[#75A47F]/50"
              >
                Trả lời
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {cards.length === 0
                ? "Không có thẻ nào có sẵn"
                : "Thử thách đã hoàn thành!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {cards.length === 0
                ? "Không có thẻ nào có sẵn cho thử thách này."
                : "Xin chúc mừng! Bạn đã hoàn thành tất cả các câu hỏi. 🎉🎉🎉"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeMode;
