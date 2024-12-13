import { useState } from "react";
import axios from "axios";
import React from "react";

function Generate({
  onClose,
  onGenerate,
}: {
  onClose: () => void;
  onGenerate: (results: any[]) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-flashcards",
        { prompt }
      );
      const generatedResults = response.data.data; // Giả định API trả về mảng kết quả
      onGenerate(generatedResults); // Gửi kết quả lên `FlashCard`
      console.log(generatedResults);
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Error calling API:", error);
      alert("Failed to generate content, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">AI hỗ trợ tạo bộ thẻ</h2>
      <textarea
        className="w-full p-4 border rounded-lg mb-4"
        placeholder="Nhập yêu cầu của bạn tại đây..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Đóng
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {loading ? "Đang tạo..." : "Tạo"}
        </button>
      </div>
    </div>
  );
}

export default Generate;
