import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddFlashCard = () => {
  const { groupId } = useParams();
  const [userFlashcards, setUserFlashcards] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserFlashcards = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/cards/${userId}`
        );
        setUserFlashcards(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user flashcards:", error);
      }
    };

    fetchUserFlashcards();
  }, []);

  const handleAddFlashcardToGroup = async (cardId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/groups/add", {
        groupId,
        cardId,
        userId,
      });
      alert("Đã gửi bộ thẻ ghi nhớ để phê duyệt.");
      navigate(`/group`);
    } catch (error) {
      console.error("Không thể thêm thẻ ghi nhớ vào nhóm:", error);
      alert("Không thể thêm thẻ ghi nhớ vào nhóm.");
    }
  };

  if (userFlashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không có bộ thẻ nào có sẵn
          </h2>
          <p className="text-gray-600">
            Trước tiên hãy tạo một số thẻ ghi nhớ để thêm chúng vào nhóm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Danh sách bộ thẻ của bạn
          </h1>
          <p className="text-lg text-gray-600">
            Chọn một bộ thẻ ghi nhớ từ bộ sưu tập của bạn để thêm vào nhóm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userFlashcards.map((flashcard) => (
            <div
              key={flashcard._id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {flashcard.title.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    {flashcard.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 line-clamp-2">
                    {flashcard.description || "No description available."}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{flashcard.cards.length} thẻ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {new Date(flashcard.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddFlashcardToGroup(flashcard._id)}
                  className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Chia sẻ vào nhóm
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/group")}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
          >
            Quay lại nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFlashCard;
