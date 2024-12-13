import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GroupDetail = ({ groupId }) => {
  const [group, setGroup] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any>([]);
  const [approvedFlashcards, setApprovedFlashcards] = useState<any[]>([]);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to control edit mode
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [groups, setGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleNavigateToAddFlashcard = () => {
    navigate(`${groupId}/add`);
  };

  const pendingFlashcards = flashcards.filter(
    (flashcard) => flashcard.status === "Pending"
  );

  const fetchFlashcardDetails = async (cardId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cards/card/${cardId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch flashcard details:", error);
      return null;
    }
  };

  const handleApproveFlashcard = async (cardId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/groups/${cardId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      setFlashcards(
        flashcards.map((fc: any) =>
          fc._id === cardId ? { ...fc, status: "Approved" } : fc
        )
      );
    } catch (error) {
      console.error("Failed to approve flashcard:", error);
      alert(
        error.response?.data?.message || "Failed to approve the flashcard."
      );
    }
  };

  const toggleFavorite = async (cardId, isFavorite) => {
    console.log(isFavorite);
    try {
      const userId = localStorage.getItem("userId");
      if (isFavorite) {
        // Nếu đã yêu thích, xóa trạng thái yêu thích
        await axios.post("http://localhost:5000/api/favorites/remove", {
          userId,
          cardId,
        });
      } else {
        // Nếu chưa yêu thích, thêm trạng thái yêu thích
        await axios.post("http://localhost:5000/api/favorites/add", {
          userId,
          cardId,
        });
      }
      // Cập nhật danh sách deck
      setFlashcards((prevDecks) =>
        prevDecks.map((deck) =>
          deck._id === cardId ? { ...deck, isFavorite: !isFavorite } : deck
        )
      );
      alert("Thêm vào danh sách yêu thích thành công!");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Bộ thẻ này đã được bạn lưu vào danh sách yêu thích!");
    }
  };

  const handleRejectFlashcard = async (cardId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/groups/${cardId}/reject`
      );
      alert(response.data.message);
      setFlashcards(
        flashcards.map((fc: any) =>
          fc._id === cardId ? { ...fc, status: "Rejected" } : fc
        )
      );
    } catch (error) {
      console.error("Failed to reject flashcard:", error);
      alert(error.response?.data?.message || "Failed to reject the flashcard.");
    }
  };

  const handleDeleteFlashcard = async (cardId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bộ thẻ ghi nhớ này không??"))
      return;

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await axios.delete(
        `http://localhost:5000/api/groups/${cardId}`,
        {
          headers: { Authorization: `Bearer ${token}`, "x-user-id": userId },
        }
      );

      alert(response.data.message);
      setApprovedFlashcards(
        approvedFlashcards.filter((card) => card._id !== cardId)
      );
    } catch (error) {
      console.error("Failed to delete flashcard:", error);
      alert(error.response?.data?.message || "Failed to delete the flashcard.");
    }
  };

  const handleUpdateGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          name: groupName,
          description: groupDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Thành công!");
      setGroup(response.data.group);
      setIsEditing(false); // Exit edit mode
      window.location.reload();
    } catch (error) {
      console.error("Failed to update group:", error);
      alert(error.response?.data?.message || "Failed to update group.");
    }
  };

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/groups/g/${groupId}`
        );
        const { group } = response.data;
        const groupCardResponse = await axios.get(
          `http://localhost:5000/api/groups/c/${groupId}`
        );
        const groupCards = groupCardResponse.data;
        const approvedCards = await Promise.all(
          groupCards
            .filter((card: any) => card.status === "Approved")
            .map(async (card: any) => {
              const details = await fetchFlashcardDetails(card.cardId);
              return { ...details, ...card };
            })
        );
        setGroup(group);
        setFlashcards(groupCards);
        setApprovedFlashcards(approvedCards);

        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("username");
        if (
          Array.isArray(group.members) &&
          group.members.some((member) => member.username === userName)
        ) {
          setIsMember(true);
        } else {
          setIsMember(false);
        }
        if (group.userId?.username === userName) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to fetch group details:", error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleLeaveGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        `http://localhost:5000/api/groups/${groupId}/leave`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Failed to leave group:", error);
      alert(error.response?.data?.message || "Failed to leave the group.");
    }
  };

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/groups/${userId}`
        );
        setGroups(response.data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    fetchUserGroups();
  }, []);

  const handleDeleteGroup = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhóm này không?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/groups/group/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      navigate("/group"); // Chuyển hướng về danh sách nhóm sau khi xóa
    } catch (error) {
      console.error("Failed to delete group:", error);
      alert(error.response?.data?.message || "Failed to delete group.");
    }
  };

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {group.name}
              </h1>
              <p className="text-lg text-gray-600">{group.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span>Admin: {group.userId?.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span>{group.memberCount} thành viên</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl mb-6"
            >
              Chỉnh sửa
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleDeleteGroup}
              className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl mb-6 hover:from-red-800 hover:to-red-900 transition-all duration-300 shadow-sm hover:shadow"
            >
              Xóa
            </button>
          )}
        </div>

        {isEditing && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa</h2>
            <div>
              <label className="block text-lg text-gray-700 mb-2">
                Tên nhóm
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-4 bg-gray-100 rounded-lg mb-4"
              />
            </div>
            <div>
              <label className="block text-lg text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full p-4 bg-gray-100 rounded-lg mb-4"
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleUpdateGroup}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {isAdmin && pendingFlashcards.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bộ thẻ đang chờ duyệt
            </h2>
            <div className="grid gap-4">
              {pendingFlashcards.map((flashcard) => (
                <div
                  key={flashcard._id}
                  className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between"
                >
                  <p className="font-medium text-gray-900">
                    {flashcard.cardId}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApproveFlashcard(flashcard._id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleRejectFlashcard(flashcard._id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Danh sách bộ thẻ
          </h2>
          <div className="grid gap-6 max-h-[450px] overflow-y-auto">
            {approvedFlashcards.slice().map((flashcard) => (
              <div
                key={flashcard._id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        toggleFavorite(flashcard.cardId, flashcard.isFavorite)
                      }
                      className={`text-2xl ${
                        flashcard.isFavorite ? "text-pink-500" : "text-gray-400"
                      } hover:text-pink-600 transition-colors duration-300`}
                    >
                      {flashcard.isFavorite ? "❤️" : "🤍"}
                    </button>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {flashcard.title}
                    </h3>
                    <p className="text-gray-600">{flashcard.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <p>{flashcard.cards.length} thẻ</p>
                      <p>Ngày duyệt: {new Date().toLocaleDateString()}</p>
                      <p>Tạo bởi: {flashcard.userId?.username || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/card/${flashcard.cardId}`)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    >
                      Học ngay
                    </button>
                    {flashcard.userId?._id ===
                      localStorage.getItem("userId") && (
                      <button
                        onClick={() => handleDeleteFlashcard(flashcard._id)}
                        className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
                      >
                        Xóa
                      </button>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/group/${flashcard.cardId}/comments`)
                      }
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                      Bình luận
                    </button>
                    <button
                      onClick={() => navigate(`/challenge/${flashcard.cardId}`)}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                    >
                      Thử thách
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isMember && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleLeaveGroup}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow"
            >
              Rời nhóm
            </button>
            <button
              onClick={handleNavigateToAddFlashcard}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-sm hover:shadow"
            >
              Chia sẻ bộ thẻ của bạn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
