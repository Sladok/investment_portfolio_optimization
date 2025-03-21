import { useState } from "react";
import { createPortfolio } from "../api/portfolio";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Подключаем Header

const CreatePortfolio = () => {
  const [name, setName] = useState("");
  const [stocks, setStocks] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      stocks: stocks.split(",").map((s) => s.trim()) // Разделение строк
    };

    const result = await createPortfolio(data);
    if (result) {
      navigate("/portfolios");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Контейнер для формы */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#A78BFA]">
            Создать портфель
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Название портфеля"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none transition"
            />
            <input
              type="text"
              placeholder="Акции (через запятую)"
              value={stocks}
              onChange={(e) => setStocks(e.target.value)}
              className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none transition"
            />
            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Создать
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;
