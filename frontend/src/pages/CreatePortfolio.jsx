import { useState } from "react";
import { createPortfolio } from "../api/portfolio";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";

const CreatePortfolio = () => {
  const [name, setName] = useState("");
  const [stocks, setStocks] = useState([{ ticker: "", allocation: 0 }]);
  const navigate = useNavigate();
  const location = useLocation();
  const fetchPortfolios = location.state?.fetchPortfolios;

  const handleStockChange = (index, field, value) => {
    const newStocks = [...stocks];
    newStocks[index][field] = field === "allocation" ? parseFloat(value) : value;
    setStocks(newStocks);
  };

  const addStock = () => {
    setStocks([...stocks, { ticker: "", allocation: 0 }]);
  };

  const removeStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
    setStocks(newStocks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validStocks = stocks
      .map((s) => ({ ticker: s.ticker.trim(), allocation: parseFloat(s.allocation) }))
      .filter((s) => s.ticker && s.allocation > 0);

    const total = validStocks.reduce((sum, s) => sum + s.allocation, 0);
    if (total !== 100) {
      alert("Сумма процентов акций должна быть ровно 100%");
      return;
    }

    const data = {
      name,
      stocks: validStocks,
    };

    const result = await createPortfolio(data);
    if (result) {
      if (fetchPortfolios) await fetchPortfolios();
      navigate("/portfolios");
      navigate(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      <Helmet>
        <title>Создание портфеля</title>
      </Helmet>

      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xl p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#A78BFA]">
            Создать портфель
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Название портфеля"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
            />

            <div className="space-y-2">
              {stocks.map((stock, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Тикер"
                    value={stock.ticker}
                    onChange={(e) => handleStockChange(index, "ticker", e.target.value)}
                    className="flex-1 p-2 bg-[#2A2A40] border border-gray-600 rounded"
                  />
                  <input
                    type="number"
                    placeholder="%"
                    value={stock.allocation}
                    onChange={(e) => handleStockChange(index, "allocation", e.target.value)}
                    className="w-20 p-2 bg-[#2A2A40] border border-gray-600 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeStock(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStock}
                className="text-[#A78BFA] hover:underline mt-2"
              >
                + Добавить акцию
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg"
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


// import { useState } from "react";
// import { createPortfolio } from "../api/portfolio";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import { Helmet } from "react-helmet-async";

// const CreatePortfolio = ({ setPortfolios }) => {
//   const [name, setName] = useState("");
//   const [stocks, setStocks] = useState(""); // Пример: "AAPL:50,GOOG:30,AMZN:20"
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Преобразуем строку в массив объектов с тикерами и процентами
//     const stocksArray = stocks.split(",").map(stock => {
//       const [symbol, percentage] = stock.split(":");
//       return { symbol: symbol.trim(), percentage: parseFloat(percentage.trim()) };
//     });

//     // Проверим, что сумма процентов равна 100
//     const totalPercentage = stocksArray.reduce((acc, stock) => acc + stock.percentage, 0);
//     if (totalPercentage !== 100) {
//       alert("Сумма процентов должна быть равна 100%");
//       return;
//     }

//     const data = { name, stocks: stocksArray };

//     const result = await createPortfolio(data);
//     if (result) {
//       setPortfolios(prevPortfolios => [...prevPortfolios, result]); // Обновляем локальный список портфелей
//       navigate("/portfolios");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
//       <Helmet>
//         <title>InvestNavigator - Создание портфеля</title>
//         <meta name="description" content="Создание портфеля" />
//       </Helmet>

//       <Header />

//       <div className="flex-grow flex items-center justify-center">
//         <div className="w-full max-w-lg p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
//           <h2 className="text-3xl font-bold text-center mb-6 text-[#A78BFA]">
//             Создайте свой инвестиционный портфель
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Название портфеля"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none transition"
//             />
//             <input
//               type="text"
//               placeholder="Акции и проценты (через запятую, например: AAPL:50,GOOG:30)"
//               value={stocks}
//               onChange={(e) => setStocks(e.target.value)}
//               className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none transition"
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg transition duration-200 transform hover:scale-105"
//             >
//               Создать портфель
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePortfolio;



// import { useState } from "react";
// import { createPortfolio } from "../api/portfolio";
// import { useNavigate, useLocation } from "react-router-dom"; // Добавили useLocation
// import Header from "../components/Header";
// import { Helmet } from "react-helmet-async";

// const CreatePortfolio = () => {
//   const [name, setName] = useState("");
//   const [stocks, setStocks] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const fetchPortfolios = location.state?.fetchPortfolios; // Получаем функцию

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//       name,
//       stocks: stocks.split(",").map((s) => s.trim()) // Разделение строк
//     };

//     const result = await createPortfolio(data);
//     if (result) {
//       if (fetchPortfolios) {
//         await fetchPortfolios(); // 🔥 Обновляем список портфелей
//       }
//       navigate("/portfolios"); // Переход на страницу со списком портфелей
//       navigate(0)
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
//       <Helmet>
//         <title>InvestNavigator - Создание портфеля</title>
//         <meta name="description" content="Создание портфеля" />
//       </Helmet>

//       <Header />

//       <div className="flex-grow flex items-center justify-center">
//         <div className="w-full max-w-md p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
//           <h2 className="text-2xl font-bold text-center mb-6 text-[#A78BFA]">
//             Создать портфель
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Название портфеля"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none transition"
//             />
//             <input
//               type="text"
//               placeholder="Акции (через запятую)"
//               value={stocks}
//               onChange={(e) => setStocks(e.target.value)}
//               className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] outline-none transition"
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg transition duration-200 transform hover:scale-105"
//             >
//               Создать
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePortfolio;
