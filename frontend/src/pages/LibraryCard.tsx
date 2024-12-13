import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import axios from "axios";
import dayjs from "dayjs";

export const LibraryCard = () => {
  const [decks, setDecks] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [tags, setTags] = useState<any>([]); // Lưu danh sách tags từ API
  const [groupedDecks, setGroupedDecks] = useState({});

  useEffect(() => {
    const fetchDecks = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in!");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/${userId}`
        );
        setDecks(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tag");
        setTags(response.data.data); // Gán danh sách tags vào state
      } catch (error) {
        console.error("Lỗi khi lấy tags:", error.message);
      }
    };

    fetchTags();
  }, []);

  // Nhóm các bộ thẻ theo tên tag
  useEffect(() => {
    if (tags.length > 0) {
      const grouped = decks.reduce((acc, deck) => {
        const tagIds = Array.isArray(deck.tags) ? deck.tags : [deck.tags];

        const tagNames = tagIds.map((tagId) => {
          const tag = tags.find((t) => t._id === tagId); // Tìm tên tag từ API
          return tag ? tag.name : "Khác"; // Nếu không tìm thấy tag, gán là "Khác"
        });
        // Nếu một deck có nhiều tags, nhóm theo từng tag name
        tagNames.forEach((tagName) => {
          if (!acc[tagName]) {
            acc[tagName] = [];
          }
          acc[tagName].push(deck);
        });

        return acc;
      }, {});

      setGroupedDecks(grouped);
    }
  }, [decks, tags]);

  const deleteDeck = async (deckId) => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      try {
        await axios.delete(`http://localhost:5000/api/cards/${deckId}`);
        setDecks(decks.filter((deck) => deck._id !== deckId));
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  const toggleFavorite = async (deckId, isFavorite) => {
    console.log(isFavorite);
    try {
      const userId = localStorage.getItem("userId");
      if (isFavorite) {
        // Nếu đã yêu thích, xóa trạng thái yêu thích
        await axios.post("http://localhost:5000/api/favorites/remove", {
          userId,
          cardId: deckId,
        });
      } else {
        // Nếu chưa yêu thích, thêm trạng thái yêu thích
        await axios.post("http://localhost:5000/api/favorites/add", {
          userId,
          cardId: deckId,
        });
      }
      // Cập nhật danh sách deck
      setDecks((prevDecks) =>
        prevDecks.map((deck) =>
          deck._id === deckId ? { ...deck, isFavorite: !isFavorite } : deck
        )
      );
      alert("Thêm vào danh sách yêu thích thành công!");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Bộ thẻ này đã được bạn thêm vào danh sách yêu thích!");
    }
  };

  const addNewDeck = () => {
    navigate("/flash-card");
  };

  const startLearning = (deckId) => {
    navigate(`/card/${deckId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-emerald-600 font-medium">
            Loading your flashcards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <Header
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-32 bg-gray-100 shadow-lg transition-transform z-10 duration-300 ${
          isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4 rounded-2xl mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Thư viện bộ thẻ</h1>
          <button
            onClick={addNewDeck}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">+</span>
            Tạo bộ thẻ mới
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {decks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="inline-block p-6 rounded-full bg-emerald-100 mb-6">
              <svg
                className="w-16 h-16 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Bắt đầu hành trình học tập của bạn
            </h3>
            <p className="text-gray-500 mb-6">
              Tạo bộ thẻ ghi nhớ đầu tiên của bạn để bắt đầu học
            </p>
            <button
              onClick={addNewDeck}
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300"
            >
              Tạo bộ thẻ đầu tiên của bạn
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedDecks).map(([tagName, decks]) => (
              <div key={tagName}>
                {/* Hiển thị tiêu đề chủ đề */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {tagName}
                </h2>

                {/* Danh sách các bộ thẻ trong chủ đề */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {decks.map((deck) => (
                    <div
                      key={deck._id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h2
                            onClick={() => navigate(`/card-detail/${deck._id}`)}
                            className="text-xl font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors duration-300"
                          >
                            {deck.title}
                          </h2>

                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() =>
                                toggleFavorite(deck._id, deck.isFavorite)
                              }
                              className={`text-2xl ${
                                deck.isFavorite
                                  ? "text-pink-500"
                                  : "text-gray-400"
                              } hover:text-pink-600 transition-colors duration-300`}
                            >
                              {deck.isFavorite ? "❤️" : "🤍"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDeck(deck._id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                              aria-label="Delete deck"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {deck.description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-500 mb-6">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            {deck.cards.length} thẻ
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {dayjs(deck.createdAt).format("MMM D, YYYY")}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {dayjs(deck.updatedAt).format("MMM D, YYYY")}
                          </div>
                        </div>

                        <button
                          onClick={() => startLearning(deck._id)}
                          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform group-hover:-translate-y-1 flex items-center justify-center"
                        >
                          <span className="mr-2">Học ngay</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LibraryCard;
