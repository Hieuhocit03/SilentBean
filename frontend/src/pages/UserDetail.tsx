import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";

interface FormData {
  email: string;
  username: string;
  dateOfBirth: string;
  password?: string;
}

export const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    username: "",
    dateOfBirth: "",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/${userId}`
      );
      setUser(response.data);
      setFormData({
        email: response.data.email,
        username: response.data.username,
        dateOfBirth: response.data.dateOfBirth.split("T")[0],
        password: "",
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const updateUserProfile = async () => {
    try {
      const updatedData = { ...formData };
      if (formData.password === "") {
        delete updatedData.password;
      }
      await axios.put(`http://localhost:5000/api/auth/${userId}`, updatedData);
      alert("Profile updated successfully");
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#75A47F]/10 to-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#75A47F] border-t-transparent"></div>
      </div>
    );
  }

  const InputField = ({ label, type, value, onChange, placeholder = "" }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2 rounded-lg border border-gray-200
          focus:ring-2 focus:ring-[#75A47F]/50 focus:border-[#75A47F]
          transition-all duration-200 outline-none
          bg-white/50 backdrop-blur-sm text-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#75A47F]/10 to-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
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
      <div className="max-w-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#75A47F] to-[#588561] px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {user.username}
                </h1>
                <p className="text-sm text-white/80">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 py-6">
            {editing ? (
              <div className="space-y-4">
                <InputField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <InputField
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <InputField
                  label="Ngày sinh"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
                <InputField
                  label="Mật khẩu mới"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Để trống để giữ mật khẩu hiện tại"
                />

                <div className="flex space-x-3 pt-4">
                  <button
                    className="flex-1 bg-[#75A47F] text-white px-4 py-2 rounded-lg text-sm
                      hover:bg-[#588561] active:bg-[#486E4E]
                      transition-all duration-200 shadow-md hover:shadow-lg
                      focus:outline-none focus:ring-2 focus:ring-[#75A47F]/50"
                    onClick={updateUserProfile}
                  >
                    Lưu thay đổi
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm
                      hover:bg-gray-200 active:bg-gray-300
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setEditing(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Username</p>
                    <p className="text-sm text-gray-900">{user.username}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Ngày sinh</p>
                    <p className="text-sm text-gray-900">
                      {new Date(user.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full mt-4 bg-[#75A47F] text-white px-4 py-2 rounded-lg text-sm
                    hover:bg-[#588561] active:bg-[#486E4E]
                    transition-all duration-200 shadow-md hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-[#75A47F]/50"
                  onClick={() => setEditing(true)}
                >
                  Chỉnh sửa thông tin cá nhân
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
