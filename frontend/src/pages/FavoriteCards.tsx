import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";

export const FavoriteCards = () => {
  const [favoriteCards, setFavoriteCards] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFavoriteCards = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/favorites/favorites/${userId}`
        );
        setFavoriteCards(response.data);
      } catch (error) {
        console.error("Failed to fetch favorite cards", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCards();
  }, [userId]);

  const handleRemoveFavorite = async (cardId: string) => {
    try {
      await axios.post("http://localhost:5000/api/favorites/remove", {
        userId,
        cardId,
      });
      setFavoriteCards((prev) => prev.filter((card) => card._id !== cardId));
    } catch (error) {
      console.error("Failed to remove favorite card", error);
    }
  };

  const handleLearn = (cardId) => {
    navigate(`/card/${cardId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-emerald-900 tracking-tight mb-1">
                Bộ thẻ yêu thích
              </h1>
              <p className="text-emerald-600 text-sm">
                Học những gì bạn yêu thích
              </p>
            </div>
          </div>
          <span className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-emerald-100 text-emerald-800">
            {favoriteCards.length}{" "}
            {favoriteCards.length === 1 ? "bộ thẻ" : "bộ thẻ"}
          </span>
        </div>

        {favoriteCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteCards.map((card) => (
              <div
                key={card._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100 hover:border-emerald-200"
              >
                <div className="relative p-8">
                  <div className="absolute top-4 right-4 bg-emerald-50 px-3 py-1 rounded-full text-sm text-emerald-700">
                    {card.cards?.length || 0} thẻ
                  </div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-emerald-900 line-clamp-2 group-hover:text-emerald-700 transition-colors mb-3">
                      {card.title}
                    </h2>
                    <p className="text-emerald-600 line-clamp-3 text-base leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-emerald-100">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleLearn(card._id)}
                        className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-xl hover:bg-emerald-700 transition-all duration-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
                      >
                        <span className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                            />
                          </svg>
                          Học ngay
                        </span>
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(card._id)}
                        className="flex-none bg-white text-red-600 py-3 px-6 rounded-xl hover:bg-red-50 transition-all duration-200 text-sm font-semibold border-2 border-red-200 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-emerald-200 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-10 w-10 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">
              Chưa có bộ thẻ yêu thích
            </h3>
            <p className="text-emerald-600 text-lg max-w-md mx-auto">
              Hãy thêm các bộ thẻ yêu thích để bắt đầu học!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
