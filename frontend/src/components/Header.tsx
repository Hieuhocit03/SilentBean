import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";
import axios from "axios";

const MenuButton = ({ toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className="text-white p-2.5 rounded-full hover:bg-white/20
        transform hover:scale-105 active:scale-95
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-white/40"
      aria-label="Toggle menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/cards/c/search?keyword=${keyword}`
      );
      setResults(response.data.flashcards);
      setShowResults(true);
    } catch (error) {
      console.error(
        "Lỗi khi tìm kiếm:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="relative flex-grow max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="w-full">
        <div
          className={`relative transform transition-transform duration-200 ${
            focused ? "scale-105" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={`w-full bg-white/15 text-white placeholder-gray-300 rounded-full px-6 py-3
              transition-all duration-300 ease-out
              focus:outline-none focus:bg-white/25 focus:ring-2 focus:ring-white/40
              ${focused ? "shadow-lg shadow-white/10" : ""}`}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
              text-white/80 hover:text-white transition-colors duration-200"
            aria-label="Search"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {showResults && (
        <div
          className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-xl 
            max-h-[400px] overflow-y-auto z-10 transform transition-all duration-200
            border border-gray-100"
          onMouseLeave={() => setShowResults(false)}
        >
          {results.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Không tìm thấy bộ thẻ nào.</p>
            </div>
          ) : (
            results.map((flashcard) => (
              <div
                key={flashcard._id}
                className="group p-4 hover:bg-gray-50 cursor-pointer border-b last:border-none
                  transition-all duration-200"
                onClick={() => navigate(`/card/${flashcard._id}`)}
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200">
                  {flashcard.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {flashcard.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AddButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="bg-white/15 hover:bg-white/25 text-white rounded-full p-3
        transform hover:scale-105 active:scale-95
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-white/40
        group relative"
      aria-label="Add new item"
      onClick={() => navigate("/flash-card")}
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span
        className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-black/90 text-white text-sm
          rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100
          transition-all duration-200 whitespace-nowrap shadow-lg"
      >
        Tạo thẻ mới
      </span>
    </button>
  );
};

const UserAvatar = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [randomColor, setRandomColor] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigateToProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else {
      alert("User ID not found!");
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${userId}`);
      const data = await response.json();
      setUsername(data.username || "User");
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const generateRandomColor = () => {
    const colors = [
      "from-emerald-400 to-emerald-500",
      "from-blue-400 to-blue-500",
      "from-indigo-400 to-indigo-500",
      "from-violet-400 to-violet-500",
      "from-purple-400 to-purple-500",
      "from-pink-400 to-pink-500",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    setRandomColor(colors[randomIndex]);
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
    generateRandomColor();
  }, [userId]);

  const letter = username ? username[0].toUpperCase() : "U";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-br ${randomColor} w-11 h-11
          flex items-center justify-center rounded-full text-white font-bold text-lg
          transform hover:scale-105 active:scale-95
          transition-all duration-200 shadow-lg hover:shadow-xl
          ring-2 ring-white/20 hover:ring-white/40`}
      >
        {letter}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2
            transform transition-all duration-200 z-50
            border border-gray-100"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{username}</p>
          </div>
          <button
            className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 
              flex items-center gap-3 transition-colors duration-200"
            onClick={handleNavigateToProfile}
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin cá nhân
          </button>
          <button
            className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50
              flex items-center gap-3 transition-colors duration-200"
            onClick={handleLogout}
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-[#75A47F] px-6 py-4 shadow-lg relative z-50">
      <div className="max-w-[1920px] mx-auto flex items-center gap-6">
        <MenuButton toggleSidebar={toggleSidebar} />
        <SearchBar />

        <div className="flex-grow flex justify-center">
          <img
            src={Logo}
            alt="Logo"
            className="absolute top-0 h-24 object-contain z-0 
              transform hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex items-center gap-5">
          <AddButton />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};
