import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface Card {
  id: number;
  type: "question" | "answer";
  text: string;
  isMatched?: boolean;
}

const MatchGame = () => {
  const { _id } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [matches, setMatches] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/card/${_id}`
        );
        const fetchedCards = response.data.data.cards;
        const formattedCards = fetchedCards.flatMap((c: any, index: number) => [
          { id: index, type: "question", text: c.question },
          { id: index, type: "answer", text: c.answer },
        ]);
        setCards(fetchedCards);
        setTotalPairs(fetchedCards.length);
        setShuffledCards(formattedCards.sort(() => Math.random() - 0.5));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching card data:", error);
        setIsLoading(false);
      }
    };
    if (_id) {
      fetchCard();
    }
  }, [_id]);

  useEffect(() => {
    if (gameFinished) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameFinished]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const firstCard = shuffledCards[newFlippedCards[0]];
      const secondCard = shuffledCards[newFlippedCards[1]];

      if (
        firstCard.id === secondCard.id &&
        firstCard.type !== secondCard.type
      ) {
        setTimeout(() => {
          setShuffledCards((prev) =>
            prev.map((card, idx) =>
              idx === newFlippedCards[0] || idx === newFlippedCards[1]
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches((prev) => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === totalPairs && totalPairs > 0) {
      setGameFinished(true);
    }
  }, [matches, totalPairs]);

  const resetGame = () => {
    setFlippedCards([]);
    setTime(0);
    setGameFinished(false);
    setMatches(0);
    const shuffled = cards
      .flatMap((c, index) => [
        { id: index, type: "question", text: c.question },
        { id: index, type: "answer", text: c.answer },
      ])
      .sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
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
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-600">
              Trò chơi ghép hình trí nhớ
            </h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-6 w-6 text-purple-500" />
                <span className="text-lg font-semibold text-gray-700">
                  {Math.floor(time / 60)}:
                  {(time % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                Đã tìm được: {matches}/{totalPairs}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {shuffledCards.map((card, index) => (
                <motion.div
                  key={`${index}-${card.text}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`aspect-[3/2] relative ${
                    card.isMatched ? "invisible" : ""
                  }`}
                >
                  <motion.div
                    className={`absolute inset-0 rounded-lg shadow-md cursor-pointer transform transition-all duration-300
                      ${flippedCards.includes(index) ? "rotate-y-180" : ""}
                      ${
                        card.isMatched
                          ? "opacity-0"
                          : "hover:shadow-lg hover:-translate-y-1"
                      }`}
                    onClick={() => handleCardClick(index)}
                    animate={{
                      rotateY: flippedCards.includes(index) ? 180 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className={`absolute inset-0 rounded-lg ${
                        flippedCards.includes(index)
                          ? "bg-white"
                          : "bg-gradient-to-br from-purple-500 to-indigo-600"
                      } p-4 flex items-center justify-center backface-hidden`}
                    >
                      {flippedCards.includes(index) ? (
                        <p className="text-center text-gray-800 font-medium">
                          {card.text}
                        </p>
                      ) : (
                        <span className="text-white text-2xl">?</span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {gameFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              🎉 Chúc mừng bạn! 🎉
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Bạn đã hoàn thành trò chơi trong {Math.floor(time / 60)}:
              {(time % 60).toString().padStart(2, "0")}!
            </p>
            <button
              onClick={resetGame}
              className="flex items-center justify-center mx-auto px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Chơi lại nào!
            </button>
          </motion.div>
        )}
        <div className="p-4" onClick={() => navigate(`/card/${_id}`)}>
          <button className="bg-[#75A47F] w-24 h-12 text-center text-white rounded-lg">
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchGame;
