import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ChallengeMode from "../components/ChallengeMode.tsx";
import Leaderboard from "../components/LeaderBoard.tsx";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";

export const ChallengePage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [activeTab, setActiveTab] = useState<"challenge" | "leaderboard">(
    "challenge"
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  if (!cardId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bộ thẻ không hợp lệ
          </h2>
          <p className="text-gray-600 mb-6">
            ID bộ thẻ bị thiếu hoặc không hợp lệ. Vui lòng kiểm tra URL và thử
            lại.
          </p>
          <a
            href="/"
            className="inline-block bg-[#75A47F] text-white px-6 py-3 rounded-lg
              hover:bg-[#588561] active:bg-[#486E4E]
              transition-all duration-200 shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-[#75A47F]/50"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      <div className="max-w-7xl mx-auto mt-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent 
            bg-gradient-to-r from-[#75A47F] to-[#588561]"
          >
            Thử thách ghi nhớ
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kiểm tra kiến ​​thức của bạn, cạnh tranh với người khác và theo dõi
            tiến trình của bạn trong chế độ thử thách tương tác này.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab("challenge")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${
                  activeTab === "challenge"
                    ? "bg-[#75A47F] text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              Chế độ thử thách
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${
                  activeTab === "leaderboard"
                    ? "bg-[#75A47F] text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              Bảng xếp hạng
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-opacity duration-300 ${
              activeTab === "challenge" ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <ChallengeMode cardSetId={cardId} />
          </div>
          <div
            className={`transition-opacity duration-300 ${
              activeTab === "leaderboard" ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <Leaderboard cardSetId={cardId} />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-[#75A47F]/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#75A47F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Phản hồi nhanh
            </h3>
            <p className="text-gray-600">
              Trả lời câu hỏi nhanh chóng để cải thiện điểm số và leo lên bảng
              xếp hạng.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-[#75A47F]/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#75A47F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Độ chính xác là quan trọng
            </h3>
            <p className="text-gray-600">
              Tập trung vào việc cung cấp câu trả lời chính xác để duy trì tỷ lệ
              thành công cao.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-[#75A47F]/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#75A47F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Theo dõi tiến trình
            </h3>
            <p className="text-gray-600">
              Theo dõi hiệu suất của bạn và so sánh với những người tham gia
              khác.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
