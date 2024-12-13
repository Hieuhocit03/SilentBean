import React, { useEffect, useState } from "react";
import axios from "axios";

export const DashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [mostActiveUser, setMostActiveUser] = useState<any>(null);
  const [mostActiveGroup, setMostActiveGroup] = useState<any>(null);
  const [mostUsedTags, setMostUsedTags] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/stats"
        );
        setStats(response.data.stats);
        setMostActiveUser(response.data.mostActiveUser);
        setMostActiveGroup(response.data.mostActiveGroup);
        setMostUsedTags(response.data.mostUsedTags);
      } catch (err) {
        setError("Lỗi khi tải thống kê");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tổng quan thống kê
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg opacity-90">Tổng người dùng</p>
                <p className="text-4xl font-bold mt-2">{stats.users}</p>
              </div>
              <div className="text-5xl opacity-50">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg opacity-90">Tổng nhóm</p>
                <p className="text-4xl font-bold mt-2">{stats.groups}</p>
              </div>
              <div className="text-5xl opacity-50">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg opacity-90">Tổng bộ thẻ</p>
                <p className="text-4xl font-bold mt-2">{stats.flashcards}</p>
              </div>
              <div className="text-5xl opacity-50">📚</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏆</span>
              Người dùng tích cực nhất
            </h2>
            {mostActiveUser ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {mostActiveUser.username}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Đã tạo {mostActiveUser.cardCount} bộ thẻ
                    </p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <span className="text-2xl">👑</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có dữ liệu</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">⭐</span>
              Nhóm nổi bật nhất
            </h2>
            {mostActiveGroup ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {mostActiveGroup.name}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">👥</span>
                        {mostActiveGroup.members.length} thành viên
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">📚</span>
                        {mostActiveGroup.flashcards.length} bộ thẻ
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <span className="text-2xl">🌟</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🏷️</span>
            Chủ đề được sử dụng nhiều nhất
          </h2>
          <div className="space-y-2">
            {mostUsedTags.length > 0 ? (
              mostUsedTags.map((tag: any) => (
                <div key={tag._id} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-lg font-medium text-gray-900">
                    {tag.name}
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    {tag.tagName} : {tag.count} lần được sử dụng
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
