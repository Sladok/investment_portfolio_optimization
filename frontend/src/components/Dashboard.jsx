import React, { useEffect, useState } from "react";
import CandleChart from "./CandleChart";  
import Spinner from "../components/Spinner";

const Dashboard = ({ defaultSymbol = "AAPL" }) => {
    const [symbol, setSymbol] = useState(defaultSymbol);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setError("");
        setData([]);
        setLoading(true);

        if (!symbol.trim()) {
            setError("Введите тикер акции!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/stock/${symbol.toUpperCase()}/candlestick?n_bars=1000`);
            const result = await response.json();
            
            if (result.candles) {
                const formattedData = result.candles.map(candle => ({
                    time: new Date(candle.datetime).getTime() / 1000, // переводим в timestamp (секунды)
                    open: candle.open,  
                    high: candle.high,  
                    low: candle.low,   
                    close: candle.close  
                }));
                setData(formattedData);
            } else {
                setError("Нет данных для графика!");
            }
        } catch (error) {
            setError("Ошибка: Акция не найдена или сервер недоступен");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchData();
        }
    };

    return (
        <div className="flex flex-col items-center text-white p-6 bg-[#1E1E1E] rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">График акций</h2>
            
            <div className="flex space-x-4 mb-4 w-full max-w-md">
                <input 
                    type="text" 
                    value={symbol} 
                    onChange={(e) => setSymbol(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите тикер (например, AAPL)"
                    className="px-4 py-2 border border-gray-600 rounded-md bg-[#121212] text-white w-full focus:outline-none focus:border-purple-500"
                />
                <button 
                    onClick={fetchData}
                    className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
                >
                    Найти
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {loading ? (
                <Spinner />
            ) : (
                <div className="w-full h-[500px] mt-4">
                    {data.length > 0 ? (
                        <CandleChart data={data} />
                    ) : (
                        <p className="text-yellow-400">Нет данных</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;




// import React, { useEffect, useState } from "react";
// import CandleChart from "./CandleChart";  

// const Dashboard = ({ defaultSymbol = "AAPL" }) => {
//     const [symbol, setSymbol] = useState(defaultSymbol);
//     const [data, setData] = useState([]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchData = async () => {
//         setError("");
//         setData([]);
//         setLoading(true);

//         if (!symbol.trim()) {
//             setError("Введите тикер акции!");
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await fetch(`http://localhost:8000/stock/${symbol.toUpperCase()}/candlestick?n_bars=10000`);
//             const result = await response.json();
            
//             if (result.candles) {
//                 const formattedData = result.candles.map(candle => ({
//                     time: new Date(candle.datetime).getTime() / 1000, // переводим в timestamp (секунды)
//                     open: candle.open,  
//                     high: candle.high,  
//                     low: candle.low,   
//                     close: candle.close  
//                 }));
//                 setData(formattedData);
//             } else {
//                 setError("Нет данных для графика!");
//             }
//         } catch (error) {
//             setError("Ошибка: Акция не найдена или сервер недоступен");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             fetchData();
//         }
//     };

//     return (
//         <div className="flex flex-col items-center text-white p-6 bg-[#1E1E1E] rounded-lg shadow-lg w-full">
//             <h2 className="text-2xl font-semibold mb-4">График акций</h2>
            
//             <div className="flex space-x-4 mb-4 w-full max-w-md">
//                 <input 
//                     type="text" 
//                     value={symbol} 
//                     onChange={(e) => setSymbol(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder="Введите тикер (например, AAPL)"
//                     className="px-4 py-2 border border-gray-600 rounded-md bg-[#121212] text-white w-full focus:outline-none focus:border-purple-500"
//                 />
//                 <button 
//                     onClick={fetchData}
//                     className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
//                 >
//                     Найти
//                 </button>
//             </div>

//             {error && <p className="text-red-500">{error}</p>}
//             {loading ? <p>Загрузка данных...</p> : data.length > 0 ? <CandleChart data={data} /> : <p className="text-yellow-400">Нет данных</p>}
//         </div>
//     );
// };

// export default Dashboard;


// import React, { useEffect, useState } from "react"; 
// import CandleChart from "./CandleChart";  

// const Dashboard = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/stock/AAPL/candlestick?n_bars=10000");
//                 const result = await response.json();
//                 if (result.candles) {
//                     const formattedData = result.candles.map(candle => ({
//                         time: new Date(candle.datetime).getTime() / 1000, // переводим в timestamp (секунды)
//                         open: candle.open,  
//                         high: candle.high,  
//                         low: candle.low,   
//                         close: candle.close  
//                     }));
//                     setData(formattedData);
//                 }
//             } catch (error) {
//                 console.error("Ошибка загрузки данных:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div>
//             <h2>График акций</h2>
//             {data.length > 0 ? <CandleChart data={data} /> : <p>Загрузка данных...</p>}
//         </div>
//     );
// };

// export default Dashboard;

// import React, { useEffect, useState } from "react";
// import CandleChart from "./CandleChart";  // Подключаем компонент графика

// const Dashboard = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/stock/AAPL/history");
//                 const result = await response.json();
//                 if (result.history) {
//                     const formattedData = Object.keys(result.history).map(date => ({
//                         time: date,  // Формат даты: "YYYY-MM-DD"
//                         open: result.history[date],  
//                         high: result.history[date] + 2,  
//                         low: result.history[date] - 2,   
//                         close: result.history[date],  
//                     }));
//                     setData(formattedData);
//                 }
//             } catch (error) {
//                 console.error("Ошибка загрузки данных:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div>
//             <h2>График акций</h2>
//             {data.length > 0 ? <CandleChart data={data} /> : <p>Загрузка данных...</p>}
//         </div>
//     );
// };

// export default Dashboard;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart, Candlestick } from "recharts";
// import Spinner from "../components/Spinner";

// const Dashboard = ({ defaultSymbol = "AAPL" }) => {
//     const [symbol, setSymbol] = useState(defaultSymbol);
//     const [candlestickData, setCandlestickData] = useState([]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchCandlestickData = async () => {
//         setError("");
//         setCandlestickData([]);
//         setLoading(true);

//         if (!symbol.trim()) {
//             setError("Введите тикер акции!");
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/candlestick`);
//             if (response.data.candles.length === 0) {
//                 setError("Нет данных для графика!");
//             }
//             setCandlestickData(response.data.candles);
//         } catch (err) {
//             setError("Ошибка: Акция не найдена или сервер недоступен");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCandlestickData();
//     }, []);

//     return (
//         <div className="flex flex-col items-center text-white p-6">
//             <h2 className="text-2xl font-semibold mb-4">График акций</h2>
//             <div className="flex space-x-4 mb-4">
//                 <input 
//                     type="text" 
//                     value={symbol} 
//                     onChange={(e) => setSymbol(e.target.value)}
//                     placeholder="Введите тикер (например, AAPL)"
//                     className="px-4 py-2 border rounded-md text-white"
//                 />
//                 <button 
//                     onClick={fetchCandlestickData}
//                     className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
//                 >
//                     Найти
//                 </button>
//             </div>
//             {error && <p className="text-red-500">{error}</p>}
//             {loading ? (
//                 <Spinner />
//             ) : (
//                 <div className="w-full h-[500px] mt-4">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <ComposedChart data={candlestickData}>
//                             <XAxis dataKey="datetime" tickFormatter={(tick) => tick.substring(11, 16)} stroke="#ffffff"/>
//                             <YAxis tick={{ fill: "#ffffff" }} domain={['auto', 'auto']} />
//                             <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
//                             <CartesianGrid stroke="#666" strokeDasharray="5 5" />
//                             <Candlestick 
//                                 xAxisId="x"
//                                 yAxisId="y"
//                                 open="open"
//                                 high="high"
//                                 low="low"
//                                 close="close"
//                                 stroke="#A855F7"
//                                 fill="#A855F7"
//                             />
//                         </ComposedChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
// import Spinner from "../components/Spinner";

// const Dashboard = ({ defaultSymbol = "AAPL" }) => {
//     const [symbol, setSymbol] = useState(defaultSymbol);
//     const [stock, setStock] = useState(null);
//     const [history, setHistory] = useState([]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchStockData = async () => {
//         setError("");
//         setStock(null);
//         setHistory([]);
//         setLoading(true);

//         if (!symbol.trim()) {
//             setError("Введите тикер акции!");
//             setLoading(false);
//             return;
//         }

//         try {
//             const stockResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}`);
//             setStock({
//                 ...stockResponse.data,
//                 price: parseFloat(stockResponse.data.price).toFixed(2)
//             });

//             const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history?period=3y`);
//             const formattedData = Object.entries(historyResponse.data.history).map(([date, price]) => ({
//                 date: date.substring(0, 10),
//                 price: parseFloat(price).toFixed(2)
//             }));

//             if (formattedData.length === 0) {
//                 setError("Нет данных для графика!");
//             }

//             setHistory(formattedData);
//         } catch (err) {
//             setError("Ошибка: Акция не найдена или сервер недоступен");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchStockData();
//     }, []);

//     const handleKeyDown = (e) => {
//         if (e.key === "Enter") {
//             fetchStockData();
//         }
//     };

//     return (
//         <div className="flex flex-col items-center text-white p-6">
//             <h2 className="text-2xl font-semibold mb-4">Поиск акций</h2>
//             <div className="flex space-x-4 mb-4">
//                 <input 
//                     type="text" 
//                     value={symbol} 
//                     onChange={(e) => setSymbol(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder="Введите тикер (например, AAPL)"
//                     className="px-4 py-2 border rounded-md text-white"

//                 />
//                 <button 
//                     onClick={fetchStockData}
//                     className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800"
//                 >
//                     Найти
//                 </button>
//             </div>
//             {error && <p className="text-red-500">{error}</p>}
//             {loading ? (
//                 <Spinner />
//             ) : stock && (
//                 <div className="text-center">
//                     <p className="text-lg font-medium mt-4">{stock.symbol}: <strong>${stock.price}</strong></p>
//                     <h3 className="text-xl font-semibold mt-4">Историческая цена</h3>
//                     {history.length > 0 ? (
//                         <div className="w-full h-[500px] mt-4">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <LineChart data={history}>
//                                 <XAxis dataKey="date" tickFormatter={(tick) => tick.substring(0, 7)} stroke="#ffffff"/>
//                                 <YAxis tick={{ fill: "#ffffff" }} domain={['auto', 'auto']} />
//                                 <Tooltip formatter={(value) => `$${value}`} contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
//                                 <CartesianGrid stroke="#666" strokeDasharray="5 5" />
//                                 <Line type="monotone" dataKey="price" stroke="#A855F7" strokeWidth={2} dot={{ r: 2, fill: "#A855F7" }} />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
                    
//                     ) : (
//                         !error && <p className="text-yellow-400">Нет данных для графика</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;
