import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle,
  X,
  Save,
  XCircle,
  Edit2,
  Trash2,
  Tag,
  Search,
} from "lucide-react";

export const TagManager = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [editTag, setEditTag] = useState<any>(null);
  const [error, setError] = useState("");

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tag");
      setTags(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tags:", error);
    }
  };

  const handleAddTag = async () => {
    if (tagInput.trim() !== "") {
      try {
        const response = await axios.post("http://localhost:5000/api/tag", {
          name: tagInput.trim(),
        });
        setTags([...tags, response.data.data]);
        setTagInput("");
        setError("");
      } catch (error) {
        console.error("Lỗi khi thêm tag:", error);
        setError(error.response?.data?.message || "Lỗi khi thêm tag.");
      }
    }
  };

  const handleDeleteTag = async (tagToDelete: any) => {
    try {
      await axios.delete(`http://localhost:5000/api/tag/${tagToDelete._id}`);
      setTags(tags.filter((tag) => tag._id !== tagToDelete._id));
    } catch (error) {
      console.error("Lỗi khi xóa tag:", error);
    }
  };

  const handleClearTags = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả tags?")) {
      try {
        await axios.delete("http://localhost:5000/api/tag");
        setTags([]);
      } catch (error) {
        console.error("Lỗi khi xóa tất cả tags:", error);
      }
    }
  };

  const handleEditTag = async () => {
    if (editTag && editTag.name.trim() !== "") {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tag/update/${editTag._id}`,
          { name: editTag.name.trim() }
        );
        setTags(
          tags.map((tag) =>
            tag._id === editTag._id ? response.data.updatedTag : tag
          )
        );
        setEditTag(null);
      } catch (error) {
        console.error("Lỗi khi cập nhật tag:", error);
      }
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="px-8 py-6 bg-white border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Tag className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-semibold text-gray-800">
                Quản lý chủ đề
              </h1>
            </div>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center text-red-600 border border-red-100">
                <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Add Tag Input */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nhập chủ đề mới..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                />
              </div>
              <button
                onClick={handleAddTag}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 shadow-sm"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Thêm chủ đề
              </button>
            </div>

            {/* Tags List */}
            <div className="space-y-4 mb-8">
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <div
                      key={tag._id}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                        editTag?._id === tag._id
                          ? "bg-indigo-50 border border-indigo-200"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {editTag?._id === tag._id ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={editTag.name}
                            onChange={(e) =>
                              setEditTag({ ...editTag, name: e.target.value })
                            }
                            className="w-32 px-3 py-1 bg-white rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleEditTag}
                              className="p-1.5 text-green-600 hover:text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditTag(null)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-700 font-medium">
                            {tag.name}
                          </span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => setEditTag(tag)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTag(tag)}
                              className="p-1.5 text-red-500 hover:text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-1">
                    Chưa có chủ đề nào được thêm
                  </p>
                  <p className="text-sm text-gray-400">
                    Thêm chủ đề đầu tiên của bạn để bắt đầu
                  </p>
                </div>
              )}
            </div>

            {/* Clear All Button */}
            {tags.length > 0 && (
              <button
                onClick={handleClearTags}
                className="flex items-center justify-center w-full px-6 py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200 border border-red-100"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Xóa tất cả chủ đề
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagManager;
