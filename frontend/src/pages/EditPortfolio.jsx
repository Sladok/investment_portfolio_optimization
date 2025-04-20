import AsyncSelect from "react-select/async";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchSinglePortfolio, updateSinglePortfolio, deleteSinglePortfolio } from "../features/portfolio/singlePortfolioSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EditPortfolio = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const portfolio = useSelector((state) => state.singlePortfolio.portfolio);

  const [name, setName] = useState("");
  const [stocks, setStocks] = useState([]);
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSinglePortfolio(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (portfolio) {
      setName(portfolio.name);
      setStocks(portfolio.stocks);
    }
  }, [portfolio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validStocks = stocks
      .map((s) => ({ ticker: s.ticker.trim(), allocation: parseFloat(s.allocation) }))
      .filter((s) => s.ticker && s.allocation > 0);

    const total = validStocks.reduce((sum, s) => sum + s.allocation, 0);
    if (total !== 100) {
      alert("Сумма процентов акций должна быть ровно 100");
      return;
    }

    const updatedData = { name, stocks: validStocks };
    await dispatch(updateSinglePortfolio({ id, updatedData }));
    navigate("/portfolios");
  };

  const handleOptimization = async () => {
    const tickers = stocks.map((s) => s.ticker.trim());
    const start_weights = stocks.map((s) => s.allocation / 100);

    const total = start_weights.reduce((sum, w) => sum + w, 0);
    if (Math.abs(total - 1) > 0.01) {
      alert("Сумма аллокаций должна быть 100%");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/optimize/full", {
        tickers,
        start_weights,
      });
      setOptimization(response.data);
    } catch (error) {
      console.error("Ошибка при оптимизации", error);
      setOptimization(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (index, field, value) => {
    const newStocks = [...stocks];
    newStocks[index] = {
      ...newStocks[index],
      [field]: field === "allocation" && value !== ""
        ? parseFloat(value)
        : value,
    };
    setStocks(newStocks);
  };
  
  const removeStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
    setStocks(newStocks);
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить портфель?")) {
      await dispatch(deleteSinglePortfolio(id));
      navigate("/portfolios");
    }
  };

  const handleAllocationChange = (index, value) => {
    const newStocks = [...stocks];
    newStocks[index] = {
      ...newStocks[index],
      allocation: parseFloat(value),
    };
    setStocks(newStocks);
  };
  

  const handleSelectChange = (selected) => {
    if (!selected || !selected.value) return;

    const exists = stocks.some((stock) => stock.ticker === selected.value);
    if (exists) {
      alert("Этот тикер уже добавлен");
      return;
    }

    setStocks([
      ...stocks,
      {
        ticker: selected.value,
        label: selected.label,
        allocation: 0,
      },
    ]);
  };

  const loadOptions = async (inputValue, callback) => {
    if (!inputValue || inputValue.length < 1) {
      return callback([]);
    }

    try {
      const res = await fetch(`http://localhost:8000/tickers/search?query=${inputValue}`);
      const data = await res.json();

      const formatted = data.map((item) => ({
        label: `${item.ticker} — ${item.name}`,
        value: item.ticker,
      }));

      callback(formatted);
    } catch (err) {
      console.error("Ошибка загрузки тикеров:", err);
      callback([]);
    }
  };
  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      <Helmet>
        <title>InvestNavigator - Редактирование портфеля</title>
      </Helmet>
  
      <Header />
  
      <main className="flex-grow flex flex-col items-center mt-12 px-4">
        <div className="w-full max-w-4xl space-y-12 mb-12">
  
          {/* Блок редактирования портфеля */}
          <section className="p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#A78BFA]">
              Редактирование портфеля
            </h2>
  
            <div className="space-y-8">
  
              {/* Название */}
              <div>
                <h3 className="text-xl font-semibold text-[#A78BFA]">Название портфеля</h3>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
                />
              </div>
  
              {/* Добавление акции */}
              <div>
                <h3 className="text-xl font-semibold text-[#A78BFA]">Добавить акцию</h3>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOptions}
                  onChange={handleSelectChange}
                  placeholder="Добавить акцию..."
                  className="text-black"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#2A2A40",
                      borderColor: "#4C1D95",
                      color: "white",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "white",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#aaa",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#121212",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#4C1D95" : "#121212",
                      color: "white",
                    }),
                  }}
                />
              </div>
  
              {/* Список акций */}
              <div className="space-y-4 mt-4">
                {Array.isArray(stocks) && stocks.map((stock, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1 p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg">
                      {stock.ticker.toUpperCase()}
                    </div>
                    <input
                      type="number"
                      value={stock.allocation}
                      onChange={(e) => handleStockChange(index, "allocation", e.target.value)}
                      className="w-1/4 p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
                      placeholder="%"
                    />
                    <button
                      type="button"
                      onClick={() => removeStock(index)}
                      className="text-red-400 hover:text-red-600 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
  
              {/* Кнопки */}
              <div className="space-y-4 mt-6">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg"
                >
                  Сохранить изменения
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold p-3 rounded-lg"
                >
                  Удалить портфель
                </button>
              </div>
            </div>
          </section>
  
          {/* Блок оптимизации */}
          <section className="p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-[#A78BFA]">
              Оптимизация портфеля
            </h2>
  
            <button
              onClick={handleOptimization}
              className="w-full bg-[#34D399] hover:bg-[#059669] text-white font-semibold p-3 rounded-lg"
            >
              Оптимизировать портфель
            </button>
  
            {loading && <p className="mt-4 text-center">Загрузка...</p>}
  
            {optimization && (
              <>
                {/* Метрики */}
                <div className="grid grid-cols-3 gap-3 text-sm text-gray-300 bg-[#1E1E30] p-4 rounded-lg mt-6">
                  <div>
                    📈 <span className="text-white">Ожидаемая доходность:</span>{" "}
                    {(optimization.expected_annual_return * 100).toFixed(2)}%
                  </div>
                  <div>
                    📉 <span className="text-white">Волатильность:</span>{" "}
                    {(optimization.expected_annual_volatility * 100).toFixed(2)}%
                  </div>
                  <div>
                    🔧 <span className="text-white">Квадратичная полезность:</span>{" "}
                    {(optimization.quadratic_utility * 100).toFixed(2)}%
                  </div>
                </div>
  
                {/* Таблица долей */}
                <div className="overflow-hidden rounded-lg border border-gray-700 mt-6">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-[#2A2A40] text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Тикер</th>
                        <th className="px-6 py-3">Целевая доля</th>
                        <th className="px-6 py-3">Отклонение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((stock, index) => {
                        const optimalWeight =
                          optimization.optimal_weights?.[stock.ticker] ??
                          optimization.optimal_weights?.[stock.ticker.toUpperCase()] ??
                          optimization.optimal_weights?.[stock.ticker.toLowerCase()] ??
                          0;
  
                        const deviation = (optimalWeight * 100 - stock.allocation).toFixed(2);
  
                        return (
                          <tr key={index} className="bg-[#1E1E30] border-b border-gray-700">
                            <td className="px-6 py-4 font-medium text-white">
                              {stock.ticker.toUpperCase()}
                            </td>
                            <td className="px-6 py-4">{(optimalWeight * 100).toFixed(2)}%</td>
                            <td className={`px-6 py-4 ${deviation < 0 ? "text-red-400" : "text-green-400"}`}>
                              {deviation > 0 ? "+" : ""}
                              {deviation}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
  
                {/* График доходности */}
                {optimization.performance && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-[#A78BFA] mb-4">График доходности</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={optimization.performance.dates.map((date, idx) => ({
                          date,
                          original: optimization.performance.original_cum[idx],
                          optimized: optimization.performance.optimized_cum[idx],
                        }))}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                        <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
                        <YAxis tick={{ fill: "#ccc" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#1E1E30", border: "none" }} />
                        <Legend />
                        <Line type="monotone" dataKey="original" stroke="#8884d8" dot={false} name="Изначальный" />
                        <Line type="monotone" dataKey="optimized" stroke="#82ca9d" dot={false} name="Оптимизированный" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default EditPortfolio;


// import AsyncSelect from "react-select/async";
// import { useState, useEffect } from "react";
// import { getPortfolioById, updatePortfolio, deletePortfolio } from "../api/portfolio";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../components/Header";
// import { Helmet } from "react-helmet-async";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";

// const EditPortfolio = ({ setPortfolios }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [stocks, setStocks] = useState([]);
//   const [optimization, setOptimization] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       const portfolio = await getPortfolioById(id);
//       if (portfolio) {
//         setName(portfolio.name);
//         setStocks(portfolio.stocks);
//       }
//     };
//     fetchPortfolio();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validStocks = stocks
//       .map((s) => ({ ticker: s.ticker.trim(), allocation: parseFloat(s.allocation) }))
//       .filter((s) => s.ticker && s.allocation > 0);

//     const total = validStocks.reduce((sum, s) => sum + s.allocation, 0);
//     if (total !== 100) {
//       alert("Сумма процентов акций должна быть ровно 100");
//       return;
//     }

//     const updatedData = { name, stocks: validStocks };
//     const result = await updatePortfolio(id, updatedData);

//     if (result) {
//       setPortfolios((prev) =>
//         prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
//       );
//       navigate("/portfolios");
//       navigate(0);
//     }
//   };

//   const handleOptimization = async () => {
//     const tickers = stocks.map((s) => s.ticker.trim());
//     const start_weights = stocks.map((s) => s.allocation / 100);

//     const total = start_weights.reduce((sum, w) => sum + w, 0);
//     if (Math.abs(total - 1) > 0.01) {
//       alert("Сумма аллокаций должна быть 100%");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8000/optimize/full", {
//         tickers,
//         start_weights,
//       });
//       setOptimization(response.data);
//     } catch (error) {
//       console.error("Ошибка при оптимизации", error);
//       setOptimization(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStockChange = (index, field, value) => {
//     const newStocks = [...stocks];
//     newStocks[index][field] = field === "allocation" ? parseFloat(value) : value;
//     setStocks(newStocks);
//   };

//   const removeStock = (index) => {
//     const newStocks = stocks.filter((_, i) => i !== index);
//     setStocks(newStocks);
//   };

//   const handleDelete = async () => {
//     if (window.confirm("Вы уверены, что хотите удалить портфель?")) {
//       await deletePortfolio(id);
//       setPortfolios((prev) => prev.filter((p) => p.id !== id));
//       navigate("/portfolios");
//     }
//   };

//   const handleAllocationChange = (index, value) => {
//     const newStocks = [...stocks];
//     newStocks[index].allocation = parseFloat(value);
//     setStocks(newStocks);
//   };

//   const handleSelectChange = (selected) => {
//     if (!selected || !selected.value) return;

//     const exists = stocks.some((stock) => stock.ticker === selected.value);
//     if (exists) {
//       alert("Этот тикер уже добавлен");
//       return;
//     }

//     setStocks([
//       ...stocks,
//       {
//         ticker: selected.value,
//         label: selected.label,
//         allocation: 0,
//       },
//     ]);
//   };

//   const loadOptions = async (inputValue, callback) => {
//     if (!inputValue || inputValue.length < 1) {
//       return callback([]);
//     }

//     try {
//       const res = await fetch(
//         `http://localhost:8000/tickers/search?query=${inputValue}`
//       );
//       const data = await res.json();

//       const formatted = data.map((item) => ({
//         label: `${item.ticker} — ${item.name}`,
//         value: item.ticker,
//       }));

//       callback(formatted);
//     } catch (err) {
//       console.error("Ошибка загрузки тикеров:", err);
//       callback([]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      // <Helmet>
      //   <title>InvestNavigator - Редактирование портфеля</title>
      // </Helmet>
      // <Header />
      // <div className="flex-grow flex flex-col items-center justify-start mt-12 px-4">
      //   <div className="w-full max-w-4xl space-y-12 mb-12">
      //     {/* Редактирование портфеля */}
      //     <div className="p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
      //       <h2 className="text-3xl font-bold text-center mb-6 text-[#A78BFA]">
      //         Редактирование портфеля
      //       </h2>
      //       <div className="space-y-8">
      //         <div>
      //           <h3 className="text-xl font-semibold text-[#A78BFA]">Название портфеля</h3>
      //           <input
      //             type="text"
      //             value={name}
      //             onChange={(e) => setName(e.target.value)}
      //             className="w-full p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
      //           />
      //         </div>
  
      //         <div>
      //           <h3 className="text-xl font-semibold text-[#A78BFA]">Добавить акцию</h3>
      //           <AsyncSelect
      //             cacheOptions
      //             loadOptions={loadOptions}
      //             onChange={handleSelectChange}
      //             placeholder="Добавить акцию..."
      //             className="text-black"
      //             styles={{
      //               control: (base) => ({
      //                 ...base,
      //                 backgroundColor: "#2A2A40",
      //                 borderColor: "#4C1D95",
      //                 color: "white",
      //               }),
      //               input: (base) => ({
      //                 ...base,
      //                 color: "white",
      //               }),
      //               placeholder: (base) => ({
      //                 ...base,
      //                 color: "#aaa",
      //               }),
      //               menu: (base) => ({
      //                 ...base,
      //                 backgroundColor: "#121212",
      //               }),
      //               option: (base, state) => ({
      //                 ...base,
      //                 backgroundColor: state.isFocused ? "#4C1D95" : "#121212",
      //                 color: "white",
      //               }),
      //             }}
      //           />
      //         </div>
  
      //         <div className="space-y-4 mt-4">
      //           {stocks.map((stock, index) => (
      //             <div key={index} className="flex items-center space-x-4">
      //               <div className="flex-1 p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg">
      //                 {stock.ticker.toUpperCase()}
      //               </div>
      //               <input
      //                 type="number"
      //                 value={stock.allocation}
      //                 onChange={(e) => handleAllocationChange(index, e.target.value)}
      //                 className="w-1/4 p-4 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
      //                 placeholder="%"
      //               />
      //               <button
      //                 type="button"
      //                 onClick={() => removeStock(index)}
      //                 className="text-red-400 hover:text-red-600 text-xl"
      //               >
      //                 ✕
      //               </button>
      //             </div>
      //           ))}
      //         </div>
  
      //         <button
      //           type="submit"
      //           onClick={handleSubmit}
      //           className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg mt-6"
      //         >
      //           Сохранить изменения
      //         </button>
  
      //         <button
      //           onClick={handleDelete}
      //           className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold p-3 rounded-lg"
      //         >
      //           Удалить портфель
      //         </button>
      //       </div>
      //     </div>

      //     {/* Оптимизация портфеля */}
      //     <div className="p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
      //       <h2 className="text-3xl font-bold text-center mb-6 text-[#A78BFA]">
      //         Оптимизация портфеля
      //       </h2>
      //       <button
      //         onClick={handleOptimization}
      //         className="w-full bg-[#34D399] hover:bg-[#059669] text-white font-semibold p-3 rounded-lg"
      //       >
      //         Оптимизировать портфель
      //       </button>
      //       {loading && <p className="mt-4 text-center">Загрузка...</p>}

      //       {optimization && (
      //         <>
      //           <div className="grid grid-cols-3 gap-3 text-sm text-gray-300 bg-[#1E1E30] p-4 rounded-lg mt-6">
      //             <div>
      //               📈 <span className="text-white">Ожидаемая доходность:</span>{" "}
      //               {(optimization.expected_annual_return * 100).toFixed(2)}%
      //             </div>
      //             <div>
      //               📉 <span className="text-white">Волатильность:</span>{" "}
      //               {(optimization.expected_annual_volatility * 100).toFixed(2)}%
      //             </div>
      //             <div>
      //               🔧 <span className="text-white">Квадратичная полезность:</span>{" "}
      //               {(optimization.quadratic_utility * 100).toFixed(2)}%
      //             </div>
      //           </div>

      //           <div className="overflow-hidden rounded-lg border border-gray-700 mt-6">
      //             <table className="w-full text-sm text-left">
      //               <thead className="text-xs uppercase bg-[#2A2A40] text-gray-400">
      //                 <tr>
      //                   <th className="px-6 py-3">Тикер</th>
      //                   <th className="px-6 py-3">Целевая доля</th>
      //                   <th className="px-6 py-3">Отклонение</th>
      //                 </tr>
      //               </thead>
      //               <tbody>
      //                 {stocks.map((stock, index) => {
      //                   const optimalWeight =
      //                     optimization.optimal_weights?.[stock.ticker] ??
      //                     optimization.optimal_weights?.[stock.ticker.toUpperCase()] ??
      //                     optimization.optimal_weights?.[stock.ticker.toLowerCase()] ??
      //                     0;

      //                   const deviation = (optimalWeight * 100 - stock.allocation).toFixed(2);

      //                   return (
      //                     <tr key={index} className="bg-[#1E1E30] border-b border-gray-700">
      //                       <td className="px-6 py-4 font-medium text-white">
      //                         {stock.ticker.toUpperCase()}
      //                       </td>
      //                       <td className="px-6 py-4">{(optimalWeight * 100).toFixed(2)}%</td>
      //                       <td className={`px-6 py-4 ${deviation < 0 ? "text-red-400" : "text-green-400"}`}>
      //                         {deviation > 0 ? "+" : ""}
      //                         {deviation}%
      //                       </td>
      //                     </tr>
      //                   );
      //                 })}
      //               </tbody>
      //             </table>
      //           </div>

      //           {optimization.performance && (
      //             <div className="mt-8">
      //               <h3 className="text-xl font-semibold text-[#A78BFA] mb-4">График доходности</h3>
      //               <ResponsiveContainer width="100%" height={400}>
      //                 <LineChart
      //                   data={optimization.performance.dates.map((date, idx) => ({
      //                     date,
      //                     original: optimization.performance.original_cum[idx],
      //                     optimized: optimization.performance.optimized_cum[idx]
      //                   }))}
      //                   margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      //                 >
      //                   <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      //                   <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
      //                   <YAxis tick={{ fill: "#ccc" }} />
      //                   <Tooltip contentStyle={{ backgroundColor: "#1E1E30", border: "none" }} />
      //                   <Legend />
      //                   <Line type="monotone" dataKey="original" stroke="#8884d8" dot={false} name="Изначальный" />
      //                   <Line type="monotone" dataKey="optimized" stroke="#82ca9d" dot={false} name="Оптимизированный" />
      //                 </LineChart>
      //               </ResponsiveContainer>
      //             </div>
      //           )}
      //         </>
      //       )}
      //     </div>
      //   </div>
      // </div>
//     </div>
//   );
// };

// export default EditPortfolio;