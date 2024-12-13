import React, { useState, useEffect } from "react";
import { Header } from "../components/Header.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import axios from "axios";
import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Generate from "../components/GenerateCardAI.tsx";

interface Card {
  id: number;
  question: string;
  answer: string;
  image: string | File;
}

interface Tag {
  _id: string;
  name: string;
}

interface CardFormProps {
  card: Card;
  onDelete: (id: number) => void;
  onImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: number
  ) => void;
  onUpdate: (id: number, field: string, value: string) => void;
}

const CardForm: React.FC<CardFormProps> = ({
  card,
  onDelete,
  onImageChange,
  onUpdate,
}) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-indigo-100">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <span className="font-semibold text-indigo-700">Thẻ {card.id}</span>
        <button
          onClick={() => onDelete(card.id)}
          className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
          title="Delete card"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Câu hỏi
            </label>
            <textarea
              value={card.question}
              onChange={(e) => onUpdate(card.id, "question", e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none bg-gray-50 hover:bg-white"
              placeholder="Nhập câu hỏi của bạn tại đây..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Đáp án
            </label>
            <textarea
              value={card.answer}
              onChange={(e) => onUpdate(card.id, "answer", e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none bg-gray-50 hover:bg-white"
              placeholder="Nhập đáp án của bạn tại đây..."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ảnh
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 cursor-pointer group">
              <PhotoIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-indigo-500" />
              <span className="group-hover:text-indigo-600">Chọn ảnh</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => onImageChange(e, card.id)}
              />
            </label>
            {card.image && (
              <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                ✓ Lấy ảnh thành công
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlashCard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tag");
        const data = await response.json();
        setTags(data.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  const handleGenerateResults = (results: any[]) => {
    // Lọc các dòng chứa "Câu hỏi" và "Câu trả lời"
    const filteredCards: Card[] = [];
    for (let i = 0; i < results.length; i++) {
      // Kiểm tra xem dòng hiện tại có chứa "Câu hỏi" hay không
      const questionMatch = results[i].match(/^-\s*Câu hỏi:\s*(.+)/); // Lọc "Câu hỏi"

      // Kiểm tra dòng tiếp theo có phải là "Câu trả lời"
      const answerMatch = results[i + 1]?.match(/^-\s*Câu trả lời:\s*(.+)/); // Lọc "Câu trả lời"

      if (questionMatch && answerMatch) {
        filteredCards.push({
          id: cards.length + filteredCards.length + 1, // ID mới
          question: questionMatch[1].trim(), // Nội dung câu hỏi
          answer: answerMatch[1].trim(), // Nội dung câu trả lời
          image: "", // Mặc định, có thể xử lý ảnh nếu cần
        });

        i++; // Bỏ qua dòng "Câu trả lời" đã xử lý
      }
    }

    // Thêm các thẻ mới vào danh sách thẻ hiện tại
    setCards([...cards, ...filteredCards]);
    console.log("Filtered Cards:", filteredCards);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCards(cards.map((c) => (c.id === cardId ? { ...c, image: file } : c)));
    }
  };

  const handleDeleteCard = (id: number) => {
    setDeletingCardId(id);
    setTimeout(() => {
      const updatedCards = cards.filter((card) => card.id !== id);
      const resetCards = updatedCards.map((card, index) => ({
        ...card,
        id: index + 1,
      }));
      setCards(resetCards);
      setDeletingCardId(null);
    }, 300);
  };

  const handleCardUpdate = (id: number, field: string, value: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleCreateDeck = async () => {
    const titleInput = document.querySelector(
      "input[placeholder='Nhập tiêu đề']"
    ) as HTMLInputElement;
    const descriptionTextarea = document.querySelector(
      "textarea[placeholder='Nhập mô tả']"
    ) as HTMLTextAreaElement;

    if (!titleInput?.value || !descriptionTextarea?.value) {
      alert("Vui lòng nhập đầy đủ thông tin cho bộ thẻ!");
      return;
    }

    if (!userId) {
      alert("Please log in to create a deck.");
      return;
    }

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("description", descriptionTextarea.value);
    formData.append("tags", selectedTag || "");
    formData.append("userId", userId);

    const cardsToSubmit = cards.map((card) => ({
      question: card.question,
      answer: card.answer,
      image: card.image,
    }));

    formData.append("cards", JSON.stringify(cardsToSubmit));
    cards.forEach((card) => {
      if (card.image instanceof File) {
        formData.append(`image`, card.image);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/cards", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tạo bộ thẻ thành công!");
      setCards([
        { id: 1, question: "", answer: "", image: "" },
        { id: 2, question: "", answer: "", image: "" },
        { id: 3, question: "", answer: "", image: "" },
      ]);
      navigate("/library-card");
    } catch (error) {
      console.error("Error creating deck:", error);
      alert("An error occurred while creating the deck.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <Header
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
      <div
        className={`fixed top-0 left-0 h-full w-32 bg-gray-100 shadow-lg transition-transform z-10 duration-300 ${
          isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      </div>
      <div className="sticky top-20 mt-8 mx-5">
        {/* Nút mở công cụ Generate */}
        <button
          onClick={() => setIsGenerateOpen(true)}
          className="mb-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          AI Hỗ trợ
        </button>
      </div>
      {/* Hiển thị Generate nếu đang mở */}
      {isGenerateOpen && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[500px]">
            <Generate
              onClose={() => setIsGenerateOpen(false)} // Đóng Generate
              onGenerate={handleGenerateResults} // Nhận kết quả từ Generate
            />
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-lg rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tạo bộ thẻ mới
            </h1>
            <button
              onClick={handleCreateDeck}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Tạo
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-6">
            <input
              type="text"
              placeholder="Nhập tiêu đề"
              className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
            />

            <textarea
              placeholder="Nhập mô tả"
              className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 h-32 resize-none text-lg"
            />

            <select
              value={selectedTag || ""}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg cursor-pointer"
            >
              <option value="" disabled>
                Chọn chủ đề
              </option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`transform transition-all duration-300 ${
                  deletingCardId === card.id
                    ? "scale-95 opacity-0"
                    : "scale-100 opacity-100"
                }`}
              >
                <CardForm
                  card={card}
                  onDelete={handleDeleteCard}
                  onImageChange={handleImageChange}
                  onUpdate={handleCardUpdate}
                />
              </div>
            ))}

            <button
              onClick={() => {
                const newCardId = cards.length + 1;
                setCards([
                  ...cards,
                  { id: newCardId, question: "", answer: "", image: "" },
                ]);
              }}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="text-lg font-semibold">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
