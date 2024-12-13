import React, { useState, useEffect } from "react";
import axios from "axios";

export const AdminList = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>({
    _id: "",
    username: "",
    password: "",
    fullname: "",
    role: "support",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/admin/adminlist"
        );
        setAdmins(response.data.admins);
        setError("");
      } catch (error) {
        setError("Error fetching admins");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (adminId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa admin này không ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/admin/${adminId}`);
        setAdmins(admins.filter((admin) => admin._id !== adminId));
      } catch (error) {
        setError("Error deleting admin");
        console.error("Error:", error);
      }
    }
  };

  const handleEdit = (admin: any) => {
    setCurrentAdmin({
      _id: admin._id,
      username: admin.username,
      fullname: admin.fullname,
      role: admin.role,
      password: "",
    });
    setEditMode(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAdmin.username || !currentAdmin.fullname) {
      setError("All fields are required");
      return;
    }

    try {
      if (editMode) {
        const adminData = { ...currentAdmin };
        if (!currentAdmin.password) {
          delete adminData.password;
        }
        await axios.put(
          `http://localhost:5000/api/admin/admin/${currentAdmin._id}`,
          currentAdmin
        );
        setAdmins(
          admins.map((admin) =>
            admin._id === currentAdmin._id ? currentAdmin : admin
          )
        );
        setError("");
        setEditMode(false);
      } else {
        await axios.post(
          "http://localhost:5000/api/admin/create",
          currentAdmin
        );
        setAdmins([...admins, currentAdmin]);
        setError("");
      }
      setCurrentAdmin({
        _id: "",
        username: "",
        password: "",
        fullname: "",
        role: "support",
      });
    } catch (err) {
      setError("Error saving admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            {editMode ? "Sửa thông tin" : "Thêm admin mới"}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={currentAdmin.username}
                  onChange={(e) =>
                    setCurrentAdmin({
                      ...currentAdmin,
                      username: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mật khẩu {editMode && "(Để trống nếu không thay đổi)"}
                </label>
                <input
                  type="password"
                  id="password"
                  value={currentAdmin.password}
                  onChange={(e) =>
                    setCurrentAdmin({
                      ...currentAdmin,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  {...(!editMode && { required: true })}
                />
              </div>

              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="fullname"
                  value={currentAdmin.fullname}
                  onChange={(e) =>
                    setCurrentAdmin({
                      ...currentAdmin,
                      fullname: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Chức vụ
                </label>
                <select
                  id="role"
                  value={currentAdmin.role}
                  onChange={(e) =>
                    setCurrentAdmin({ ...currentAdmin, role: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {editMode ? "Lưu thay đổi" : "Thêm Admin"}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Danh sách Admin
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      Họ tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      Chức vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.fullname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            admin.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
