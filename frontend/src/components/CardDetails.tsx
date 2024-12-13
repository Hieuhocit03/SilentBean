import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import axios from "axios";

const CardDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    cards: [],
    tags: [],
  });
  const [tagsList, setTagsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cards/card/${_id}`
        );
        setDeck(response.data.data);
        console.log(response.data.data);
        setFormData({
          title: response.data.data.title,
          description: response.data.data.description,
          cards: response.data.data.cards,
          tags: response.data.data.tags,
        });
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải thông tin bộ thẻ:", error);
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tag");
        setTagsList(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tags:", error);
      }
    };

    if (_id) {
      fetchDeck();
    }
    fetchTags();
  }, [_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number,
    field?: string
  ) => {
    if (field && typeof index === "number") {
      const updatedCards = formData.cards;
      updatedCards[index][field] = e.target.value;
      setFormData({ ...formData, cards: updatedCards });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updatedCards = formData.cards;
    updatedCards[index].image = file;
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, tags: e.target.value });
  };

  const addNewCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { question: "", answer: "" }],
    });
  };

  const removeCard = (index: number) => {
    const updatedCards = formData.cards.filter((_, i) => i !== index);
    setFormData({ ...formData, cards: updatedCards });
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("cards", JSON.stringify(formData.cards));

    formData.cards.forEach((card) => {
      if (card.image instanceof File) {
        formDataToSend.append("image", card.image);
      }
    });

    try {
      await axios.put(
        `http://localhost:5000/api/cards/${_id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Cập nhật thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật bộ thẻ:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 rounded-lg bg-white p-6 shadow-lg">
          <svg
            className="h-8 w-8 animate-spin text-[#75A47F]"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-xl font-medium text-gray-700">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "hidden" : "block"
        }`}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-4">
        <div className="mb-8 rounded-xl bg-gradient-to-r from-[#75A47F] to-[#8FB996] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Chỉnh Sửa Bộ Thẻ" : "Chi Tiết Bộ Thẻ"}
            </h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-white px-6 py-2.5 font-medium text-[#75A47F] shadow-md transition hover:bg-gray-50 hover:shadow-lg focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#75A47F]"
              >
                Chỉnh Sửa
              </button>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className="h-[calc(100vh-300px)] space-y-6 overflow-y-auto pr-4">
            <div className="rounded-xl bg-white p-8 shadow-lg transition hover:shadow-xl max-w-md mx-auto">
              {/* Thẻ Tag */}
              <div className="flex justify-start mb-4">
                <span className="rounded-full bg-[#75A47F]/10 px-4 py-1.5 text-sm font-medium text-[#75A47F]">
                  {deck.tags.name}
                </span>
              </div>

              {/* Tiêu đề */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tiêu đề: {deck.title}
              </h2>

              {/* Mô tả */}
              <p className="mt-3 text-lg text-gray-600 leading-relaxed">
                Mô tả: {deck.description}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">
                Tổng số thẻ: {deck.cards.length}
              </h3>
              {deck.cards.map((card: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl bg-white p-6 shadow-lg transition hover:shadow-xl"
                >
                  <div className="grid gap-8 sm:grid-cols-[240px,1fr]">
                    {card.image && (
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={card.image}
                          alt=""
                          className="h-[240px] w-full object-cover transition hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/path-to-default-image.png";
                          }}
                        />
                      </div>
                    )}
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Câu hỏi
                        </label>
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {card.question}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Câu trả lời
                        </label>
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {card.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-300px)] space-y-6 overflow-y-auto pr-4">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#75A47F] focus:outline-none focus:ring-2 focus:ring-[#75A47F]/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#75A47F] focus:outline-none focus:ring-2 focus:ring-[#75A47F]/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Chủ đề
                  </label>
                  <select
                    value={formData.tags || ""}
                    onChange={handleTagChange}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#75A47F] focus:outline-none focus:ring-2 focus:ring-[#75A47F]/20"
                  >
                    <option value="">Chọn chủ đề</option>
                    {Array.isArray(tagsList) &&
                      tagsList.map((tag) => (
                        <option key={tag._id} value={tag._id}>
                          {tag.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Câu hỏi ({formData.cards.length})
                </h3>
                <button
                  onClick={addNewCard}
                  className="flex items-center rounded-lg bg-[#75A47F] px-6 py-2.5 font-medium text-white shadow-md transition hover:bg-[#75A47F]/90 hover:shadow-lg focus:ring-2 focus:ring-[#75A47F] focus:ring-offset-2"
                >
                  <svg
                    className="mr-2 h-5 w-5"
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
                  Thêm câu hỏi
                </button>
              </div>

              {formData.cards.map((card: any, index: number) => (
                <div
                  key={index}
                  className="relative rounded-xl bg-white p-8 shadow-lg transition hover:shadow-xl"
                >
                  <button
                    onClick={() => removeCard(index)}
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div className="grid gap-8 sm:grid-cols-[240px,1fr]">
                    <div className="space-y-4">
                      <div className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#75A47F]/50 hover:bg-gray-100">
                        {card.image ? (
                          <img
                            src={
                              typeof card.image === "string"
                                ? card.image
                                : URL.createObjectURL(card.image)
                            }
                            alt=""
                            className="h-full w-full object-cover transition group-hover:opacity-75"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <svg
                              className="h-12 w-12 text-gray-400 transition group-hover:text-[#75A47F]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, index)}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Câu hỏi
                        </label>
                        <input
                          type="text"
                          value={card.question}
                          onChange={(e) =>
                            handleInputChange(e, index, "question")
                          }
                          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#75A47F] focus:outline-none focus:ring-2 focus:ring-[#75A47F]/20"
                          placeholder="Nhập câu hỏi..."
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Câu trả lời
                        </label>
                        <input
                          type="text"
                          value={card.answer}
                          onChange={(e) =>
                            handleInputChange(e, index, "answer")
                          }
                          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#75A47F] focus:outline-none focus:ring-2 focus:ring-[#75A47F]/20"
                          placeholder="Nhập câu trả lời..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-4 bg-gray-50  py-6">
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center rounded-lg bg-[#75A47F] px-6 py-2.5 font-medium text-white shadow-md transition hover:bg-[#75A47F]/90 hover:shadow-lg focus:ring-2 focus:ring-[#75A47F] focus:ring-offset-2"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Lưu thay đổi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetails;
