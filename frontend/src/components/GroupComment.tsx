import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const GroupComment = () => {
  const cardId = useParams().cardId;
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [flashcard, setFlashcard] = useState<any | null>(null);
  const [cardCreator, setCardCreator] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashcardAndComments = async () => {
      try {
        const flashcardResponse = await axios.get(
          `http://localhost:5000/api/cards/card/${cardId}`
        );
        setFlashcard(flashcardResponse.data.data);

        const commentsResponse = await axios.get(
          `http://localhost:5000/api/groups/${cardId}/comments`
        );
        setComments(commentsResponse.data.comments);
        setCardCreator(commentsResponse.data.cardCreator);
      } catch (error) {
        console.error("Error fetching flashcard or comments:", error);
      }
    };

    fetchFlashcardAndComments();
  }, [cardId]);

  const handleAddComment = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/groups/${cardId}/comment`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );
      setNewComment("");
      const response = await axios.get(
        `http://localhost:5000/api/groups/${cardId}/comments`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/groups/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );
      const response = await axios.get(
        `http://localhost:5000/api/groups/${cardId}/comments`
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {flashcard && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {flashcard.title}
              </h1>
              <span className="text-sm text-gray-500">
                Tạo bởi: {cardCreator}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out placeholder-gray-400 resize-none min-h-[100px]"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="mt-3 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Đăng bình luận
            </button>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {comment.userId?.username}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {comment.userId?._id === localStorage.getItem("userId") && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-sm px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ
                của bạn!
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <button
            onClick={() => navigate("/group")}
            className="bg-[#75A47F] w-20 h-10 text-center text-white rounded-lg hover:bg-[#75A47F]/90 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupComment;
