import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupList = ({ onSelectGroup }) => {
  const [createdGroups, setCreatedGroups] = useState<any[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/groups/${userId}`
        );
        const { created, joined } = response.data;
        setCreatedGroups(created || []);
        setJoinedGroups(joined || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredCreatedGroups = createdGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJoinedGroups = joinedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Đang tải thông tin nhóm của bạn ...
          </p>
        </div>
      </div>
    );
  }

  const GroupCard = ({ group, type }) => (
    <div
      onClick={() => onSelectGroup(group._id)}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        type === "created"
          ? "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50"
          : "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50"
      }`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-10 
        ${type === 'created' ? 'from-blue-400' : 'from-emerald-400'}"
      ></div>
      <div className="p-6">
        <div className="mb-4 flex flex-col justify-between items-end">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide mb-2 ${
              type === "created"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {type === "created" ? "Owner" : "Member"}
          </span>
          <h3
            className={`text-xl font-bold ${
              type === "created" ? "text-blue-700" : "text-emerald-700"
            } w-full break-words`}
          >
            {group.name}
          </h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {group.description || "No description provided"}
        </p>
        <div
          className={`mt-4 flex items-center justify-between ${
            type === "created" ? "text-blue-600" : "text-emerald-600"
          }`}
        >
          <span className="flex items-center text-sm font-medium">
            Xem thông tin
            <svg
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span className="text-xs text-gray-500">
            {group.members?.length || 0} thành viên
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Nhóm của bạn
          </h1>
          <p className="text-lg text-gray-600">
            Quản lý và tham gia vào nhóm học tập của bạn
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhóm ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border-2 border-gray-200 px-6 py-3 pl-12 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Created Groups Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Nhóm đã tạo</h2>
            <p className="mt-2 text-gray-600">Các nhóm bạn đã tạo và quản lý</p>
          </div>

          {filteredCreatedGroups.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCreatedGroups.map((group) => (
                <GroupCard key={group._id} group={group} type="created" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-4 text-lg font-medium text-gray-900">
                Chưa có nhóm nào được tạo
              </p>
              <p className="mt-2 text-gray-500">
                Bắt đầu bằng cách tạo nhóm học tập đầu tiên của bạn
              </p>
            </div>
          )}
        </section>

        {/* Joined Groups Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Nhóm đã tham gia
            </h2>
            <p className="mt-2 text-gray-600">Các nhóm bạn đang tham gia</p>
          </div>

          {filteredJoinedGroups.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJoinedGroups.map((group) => (
                <GroupCard key={group._id} group={group} type="joined" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-900">
                Không có nhóm nào tham gia
              </p>
              <p className="mt-2 text-gray-500">
                Tham gia một nhóm để bắt đầu chia sẻ và cùng nhau học tập
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GroupList;
