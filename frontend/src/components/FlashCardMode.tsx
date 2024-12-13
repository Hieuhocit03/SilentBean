import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

interface Deck {
  _id: string;
  title: string;
  cards: Array<{
    question: string;
    answer: string;
    image?: string;
  }>;
}

const FlashcardMode = () => {
  const { _id } = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/card/${_id}`
        );
        setDeck(response.data.data);
      } catch (error) {
        console.error("Error fetching deck:", error);
      }
    };
    if (_id) {
      fetchDeck();
    }
  }, [_id]);

  const handleCardFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowAnswer(!showAnswer);
      setIsFlipping(false);
    }, 150);
  };

  const handleNextCard = () => {
    if (!deck) return;
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % deck.cards.length);
  };

  const handlePrevCard = () => {
    if (!deck) return;
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? deck.cards.length - 1 : prevIndex - 1
    );
  };

  const navigateToMode = (mode: string) => {
    navigate(`/card-${mode}/${_id}`);
  };

  if (!deck) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#75A47F]/10 to-white">
        <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#75A47F] border-t-transparent"></div>
          <p className="mt-3 text-base font-medium text-[#75A47F]">
            Đang tải...
          </p>
        </div>
      </div>
    );
  }

  if (!deck.cards || deck.cards.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-[#75A47F]/10 to-white">
        <div className="text-center rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-3 text-xl font-bold text-[#75A47F]">
            Không tìm thấy thẻ
          </h2>
          <p className="text-sm text-gray-600">Bộ thẻ này chưa có thẻ nào.</p>
        </div>
      </div>
    );
  }

  const currentCard = deck.cards[currentCardIndex];

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

      <div className="mx-auto max-w-4xl px-4 pt-3">
        <div className="mb-4 text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#75A47F]">
            Tiêu đề: {deck.title}
          </h1>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => navigateToMode("ar")}
              className="flex items-center rounded-lg bg-[#75A47F] px-4 py-2 text-sm text-white shadow-md transition-all hover:bg-[#75A47F]/90 hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#75A47F]/50 focus:ring-offset-2"
            >
              <AcademicCapIcon className="mr-2 h-4 w-4" />
              Active Recall Mode
            </button>
            <button
              onClick={() => navigateToMode("game")}
              className="flex items-center rounded-lg border-2 border-[#75A47F] bg-white px-4 py-2 text-sm text-[#75A47F] shadow-md transition-all hover:bg-[#75A47F]/10 hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-[#75A47F]/50 focus:ring-offset-2"
            >
              <PuzzlePieceIcon className="mr-2 h-4 w-4" />
              Math Game Mode
            </button>
          </div>
        </div>

        <div className="relative flex min-h-[400px] items-center justify-center px-8">
          <button
            onClick={handlePrevCard}
            className="absolute left-0 z-10 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:ring-2 focus:ring-[#75A47F]/50 focus:ring-offset-2"
          >
            <ChevronLeftIcon className="h-6 w-6 text-[#75A47F]" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex + (showAnswer ? "-answer" : "-question")}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`w-full cursor-pointer rounded-xl bg-white p-6 shadow-xl transition-shadow hover:shadow-2xl
                ${isFlipping ? "pointer-events-none" : ""}`}
              onClick={handleCardFlip}
            >
              <div className="flex min-h-[350px] flex-col justify-between">
                <div className="flex flex-1 items-center justify-center p-3">
                  <p className="text-center text-2xl font-medium text-gray-800">
                    {showAnswer ? currentCard.answer : currentCard.question}
                  </p>
                </div>
                {currentCard.image && (
                  <div className="mt-4 overflow-hidden rounded-lg">
                    <img
                      src={currentCard.image}
                      alt="Card visual"
                      className="h-[200px] w-full object-contain transition hover:scale-105"
                    />
                  </div>
                )}
                <div className="mt-4 flex items-center justify-center space-x-2 border-t border-gray-100 pt-4">
                  <span className="rounded-lg bg-[#75A47F]/10 px-3 py-1.5 text-xs font-medium text-[#75A47F]">
                    Nhấn để lật thẻ
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                    Thẻ {currentCardIndex + 1} / {deck.cards.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handleNextCard}
            className="absolute right-0 z-10 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:scale-110 focus:ring-2 focus:ring-[#75A47F]/50 focus:ring-offset-2"
          >
            <ChevronRightIcon className="h-6 w-6 text-[#75A47F]" />
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="rounded-full bg-white px-4 py-2 shadow-lg">
            <div className="flex space-x-1.5">
              {deck.cards.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    index === currentCardIndex
                      ? "bg-[#75A47F] scale-125"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMode;
