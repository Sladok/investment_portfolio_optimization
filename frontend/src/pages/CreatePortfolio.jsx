import { useState } from "react";
import { createPortfolio } from "../api/portfolio";
import { useNavigate } from "react-router-dom";

const CreatePortfolio = () => {
  const [name, setName] = useState("");
  const [stocks, setStocks] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      name,
      stocks: stocks.split(",").map(s => s.trim())  // <-- Убедись, что stocks это массив!
    };
  
    // console.log("Формируемый объект:", data);  // <-- ЛОГ
    
    const result = await createPortfolio(data);
    if (result) {
      navigate("/portfolios");
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">Создать портфель</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название портфеля"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          placeholder="Акции (через запятую)"
          value={stocks}
          onChange={(e) => setStocks(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Создать
        </button>
      </form>
    </div>
  );
};

export default CreatePortfolio;
