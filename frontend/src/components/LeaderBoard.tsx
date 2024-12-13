import React, { useState, useEffect } from "react";
import axios from "axios";

interface LeaderboardEntry {
  username: string;
  totalTime: number;
}

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry; rank: number }> = ({
  entry,
  rank,
}) => {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-300 to-yellow-500";
      case 2:
        return "from-gray-300 to-gray-500";
      case 3:
        return "from-amber-500 to-amber-700";
      default:
        return "";
    }
  };

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {rank <= 3 ? (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getMedalColor(
                rank
              )}
              flex items-center justify-center text-white font-bold shadow-lg`}
            >
              {rank}
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-gray-100 
              flex items-center justify-center text-gray-600 font-medium"
            >
              {rank}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div
            className="h-10 w-10 rounded-full bg-gradient-to-br from-[#75A47F] to-[#588561]
            flex items-center justify-center text-white font-bold"
          >
            {entry.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {entry.username}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {entry.totalTime} giây
        </div>
      </td>
    </tr>
  );
};

const Leaderboard: React.FC<{ cardSetId: string }> = ({ cardSetId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/challenge/leaderboard/${cardSetId}`
        );
        setLeaderboard(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (cardSetId) {
      fetchLeaderboard();
    }
  }, [cardSetId]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#75A47F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#75A47F] to-[#588561] px-6 py-8">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <svg
            className="w-8 h-8 mr-3"
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
          Bảng xếp hạng ngày hôm nay
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người thử thách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <LeaderboardRow key={index} entry={entry} rank={index + 1} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      Bảng xếp hạng hôm nay chưa có ai
                    </p>
                    <p className="text-sm text-gray-400">
                      Hãy là người đầu tiên hoàn thành thử thách!
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
