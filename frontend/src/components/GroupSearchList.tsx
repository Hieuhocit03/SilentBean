import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupSearchList = ({ onJoinGroup }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [joinInProgress, setJoinInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/groups/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserGroups(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch user groups:", error);
      }
    };

    fetchUserGroups();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/groups?search=${search}`
        );
        setGroups(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchGroups();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleJoinGroup = async (groupId) => {
    setJoinInProgress(groupId);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        { userId }
      );

      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.classList.remove("opacity-0");
        successMessage.classList.add("opacity-100");
        setTimeout(() => {
          successMessage.classList.remove("opacity-100");
          successMessage.classList.add("opacity-0");
        }, 3000);
      }

      onJoinGroup(groupId);
    } catch (error) {
      console.error("Failed to join group:", error);
      alert(error.response?.data?.message || "Failed to join the group.");
    } finally {
      setJoinInProgress(null);
    }
  };

  const availableGroups = groups.filter(
    (group) =>
      group &&
      Array.isArray(userGroups) &&
      !userGroups.some((userGroup) => userGroup._id === group._id) &&
      (!group.members ||
        !Array.isArray(group.members) ||
        !group.members.some(
          (member) => member._id === localStorage.getItem("userId")
        ))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Khám phá cộng đồng
          </h1>
          <p className="text-lg text-gray-600">
            Kết nối với những người có cùng chí hướng trong các nhóm mà bạn quan
            tâm
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm nhóm ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 shadow-sm"
          />
        </div>

        <div
          id="success-message"
          className="fixed top-4 right-4 transform transition-opacity duration-500 opacity-0"
        >
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm">
            Đã tham gia nhóm thành công!
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {availableGroups.length > 0 ? (
              availableGroups.map((group) => (
                <li
                  key={group._id}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer ${
                    selectedGroup === group._id ? "ring-2 ring-purple-500" : ""
                  }`}
                  onClick={() => setSelectedGroup(group._id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-grow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {group.name.charAt(0).toUpperCase()}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {group.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {group.description || "No description provided"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinGroup(group._id);
                        }}
                        disabled={joinInProgress === group._id}
                        className={`shrink-0 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                          joinInProgress === group._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-sm hover:shadow"
                        }`}
                      >
                        {joinInProgress === group._id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tham gia...</span>
                          </div>
                        ) : (
                          <span>Tham gia</span>
                        )}
                      </button>
                    </div>

                    {selectedGroup === group._id && group.members && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-4 h-4">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <span>{group.members.length} thành viên</span>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Không tìm thấy nhóm nào
                </h3>
                <p className="mt-2 text-gray-500">
                  Hãy thử điều chỉnh tìm kiếm của bạn hoặc kiểm tra lại sau để
                  tìm nhóm mới.
                </p>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupSearchList;
