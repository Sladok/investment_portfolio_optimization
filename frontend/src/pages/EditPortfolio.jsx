import { useState, useEffect } from "react";
import { getPortfolioById, updatePortfolio } from "../api/portfolio";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";

const EditPortfolio = ({ setPortfolios }) => {
  const { id } = useParams(); // Получаем ID из URL
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [stocks, setStocks] = useState([]);
  // const [optimization, setOptimization] = useState(""); // Placeholder для будущей оптимизации

  useEffect(() => {
    const fetchPortfolio = async () => {
      const portfolio = await getPortfolioById(id);
      if (portfolio) {
  
        setName(portfolio.name);
        setStocks(portfolio.stocks);
      }
    };
  
    fetchPortfolio();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {
      name,
      stocks: stocks.map(stock => ({
        ticker: stock.ticker,
        allocation: stock.allocation
      }))
    };
    
  
    const result = await updatePortfolio(id, updatedData);
  
    if (result) {
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((p) =>
          p.id === id ? { ...p, ...updatedData } : p
        )
      );
      navigate("/portfolios");
      navigate(0);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      <Helmet>
        <title>InvestNavigator - Редактирование портфеля</title>
      </Helmet>

      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#A78BFA]">
            Редактирование портфеля
          </h2>

          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#A78BFA]">Название портфеля</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#A78BFA]">Акции в портфеле</h3>
              <div className="space-y-4">
                {stocks.map((stock, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={stock.ticker}
                      onChange={(e) => {
                        const newStocks = [...stocks];
                        newStocks[index].ticker = e.target.value;
                        setStocks(newStocks);
                      }}
                      className="w-full p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
                      placeholder="Тикер акции"
                    />
                    <input
                      type="number"
                      value={stock.allocation}
                      onChange={(e) => {
                        const newStocks = [...stocks];
                        newStocks[index].allocation = parseFloat(e.target.value);
                        setStocks(newStocks);
                      }}
                      className="w-1/4 p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
                      placeholder="Аллокация"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStocks([...stocks, { ticker: "", allocation: 0 }])}
                className="mt-4 w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg"
              >
                Добавить акцию
              </button>
            </div>

            {/* Оптимизация - временный блок */}
            <div className="mt-8 p-4 bg-[#2A2A40] rounded-lg text-center text-[#A78BFA]">
              <h3 className="text-xl font-semibold">Тут будет оптимизация</h3>
              {/* <p>Здесь в будущем будет реализована функциональность для оптимизации портфеля.</p> */}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg"
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;


// import { useState, useEffect } from "react";
// import { getPortfolioById, updatePortfolio } from "../api/portfolio";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../components/Header";
// import { Helmet } from "react-helmet-async";

// const EditPortfolio = ({ setPortfolios }) => {
//   const { id } = useParams(); // Получаем ID из URL
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [stocks, setStocks] = useState("");

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       const portfolio = await getPortfolioById(id);
//       if (portfolio) {
//         setName(portfolio.name);
//         setStocks(portfolio.stocks.join(", ")); // Преобразуем в строку
//       }
//     };

//     fetchPortfolio();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const updatedData = { name, stocks: stocks.split(",").map(s => s.trim()) };
//     const result = await updatePortfolio(id, updatedData);
//     if (result) {
//       setPortfolios(prevPortfolios =>
//         prevPortfolios.map(p => (p.id === id ? { ...p, ...updatedData } : p))
//       ); // Обновляем локально, без повторного запроса к API
//       navigate("/portfolios");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
//       <Helmet>
//         <title>InvestNavigator - Редактирование портфеля</title>
//       </Helmet>

//       <Header />

//       <div className="flex-grow flex items-center justify-center">
//         <div className="w-full max-w-md p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
//           <h2 className="text-2xl font-bold text-center mb-6 text-[#A78BFA]">
//             Редактировать портфель
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Название портфеля"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
//             />
//             <input
//               type="text"
//               placeholder="Акции (через запятую)"
//               value={stocks}
//               onChange={(e) => setStocks(e.target.value)}
//               className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
//             />
//             <button
//               type="submit"
//               className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg"
//             >
//               Сохранить изменения
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPortfolio;
