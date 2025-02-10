import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const [symbol, setSymbol] = useState("");
    const [stock, setStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    // Переменная для цвета темы
    const themeColor = "#5f1d8f"; // Темно-фиолетовый
    // 147659  Зеленый
    // 5f1d8f  Фиолетовый
    const fetchStockData = async () => {
        setError("");
        setStock(null);
        setHistory([]);

        if (!symbol.trim()) {
            setError("Введите тикер акции!");
            return;
        }

        try {
            const stockResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}`);
            setStock({
                ...stockResponse.data,
                price: parseFloat(stockResponse.data.price).toFixed(2)
            });

            const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history?period=1y`);

            const formattedData = Object.entries(historyResponse.data.history).map(([date, price]) => ({
                date: date.substring(0, 10), // YYYY-MM-DD
                price: parseFloat(price).toFixed(2)
            }));

            if (formattedData.length === 0) {
                setError("Нет данных для графика!");
                return;
            }

            setHistory(formattedData);
        } catch (err) {
            setError("Ошибка: Акция не найдена или сервер недоступен");
        }
    };

    return (
        <div style={{ textAlign: "center", color: "#ffffff" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Поиск акций</h2>
            
            <input 
                type="text" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Введите тикер (например, AAPL)"
                style={{
                    padding: "8px",
                    fontSize: "16px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    border: "none"
                }}
            />
            <button 
                onClick={fetchStockData}
                style={{
                    padding: "8px 15px",
                    fontSize: "16px",
                    backgroundColor: themeColor, // Используем переменную
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Найти
            </button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {stock && (
                <div>
                    <p style={{ fontSize: "18px", marginTop: "10px" }}>
                        {stock.symbol}: <strong>${stock.price}</strong>
                    </p>

                    <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Историческая цена</h3>
                    
                    {history.length > 0 ? (
                        <div style={{ width: "800px", height: "700px", margin: "auto" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart width={800} height={600} data={history}>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(tick) => {
                                            const date = new Date(tick);
                                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                                        }}
                                    />

                                    <YAxis 
                                        tick={{ fill: "#ffffff" }} 
                                        domain={["auto", "auto"]} 
                                    />
                                    <Tooltip 
                                        formatter={(value) => `$${value}`} 
                                        contentStyle={{ backgroundColor: "#333", color: "#fff" }} 
                                    />
                                    <CartesianGrid stroke="#444" strokeDasharray="5 5" />
                                    <Line 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke={themeColor} // Используем переменную
                                        strokeWidth={2} 
                                        dot={{ r: 1, fill: themeColor }} // Используем переменную
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ color: "yellow" }}>Нет данных для отображения графика</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;







// import React, { useState } from "react";
// import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//     const [symbol, setSymbol] = useState("");
//     const [stock, setStock] = useState(null);
//     const [history, setHistory] = useState([]);
//     const [error, setError] = useState("");

//     const fetchStockData = async () => {
//       setError("");
//       setStock(null);
//       setHistory([]);
  
//       if (!symbol.trim()) {
//           setError("Введите тикер акции!");
//           return;
//       }
  
//       try {
//           const stockResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}`);
//           setStock(stockResponse.data);
          
//           const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history?period=1y`);
          
//           console.log("Исторические данные:", historyResponse.data);
  
//           if (!historyResponse.data.history || Object.keys(historyResponse.data.history).length === 0) {
//               setError("Нет данных для графика!");
//               return;
//           }
  
//           // 🔹 Преобразуем объект JSON в массив { date, price }
//           const formattedData = Object.entries(historyResponse.data.history).map(([date, price]) => ({
//               date: new Date(date), // Преобразуем строку в объект Date
//               price
//           }));
  
//           setHistory(formattedData);
//       } catch (err) {
//           setError("Ошибка: Акция не найдена или сервер недоступен");
//       }
//   };
  

//     return (
//         <div style={{ textAlign: "center", color: "#ffffff" }}>
//             <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>📈 Поиск акций</h2>
            
//             <input 
//                 type="text" 
//                 value={symbol} 
//                 onChange={(e) => setSymbol(e.target.value)}
//                 placeholder="Введите тикер (например, AAPL)"
//                 style={{
//                     padding: "8px",
//                     fontSize: "16px",
//                     marginRight: "10px",
//                     borderRadius: "5px",
//                     border: "none"
//                 }}
//             />
//             <button 
//                 onClick={fetchStockData}
//                 style={{
//                     padding: "8px 15px",
//                     fontSize: "16px",
//                     backgroundColor: "#4CAF50",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "5px",
//                     cursor: "pointer"
//                 }}
//             >
//                 Найти
//             </button>

//             {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

//             {stock && (
//                 <div>
//                     <p style={{ fontSize: "18px", marginTop: "10px" }}>
//                         {stock.symbol}: <strong>${stock.price}</strong>
//                     </p>

//                     <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Историческая цена</h3>
                    
//                     {history.length > 0 ? (
//                         <div style={{ width: "80%", height: "400px", margin: "auto" }}>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <LineChart data={history}>
//                                     <XAxis 
//                                         dataKey="date" 
//                                         tickFormatter={(date) => date.toLocaleDateString()} 
//                                         tick={{ fill: "#ffffff" }}
//                                     />

//                                     <YAxis 
//                                         tick={{ fill: "#ffffff" }} 
//                                         domain={["auto", "auto"]} 
//                                     />
//                                     <Tooltip 
//                                         contentStyle={{ backgroundColor: "#333", color: "#fff" }} 
//                                     />
//                                     <CartesianGrid stroke="#444" strokeDasharray="5 5" />
//                                     <Line 
//                                         type="monotone" 
//                                         dataKey="price" 
//                                         stroke="#00FF99" 
//                                         strokeWidth={2} 
//                                         dot={{ r: 4, fill: "#00FF99" }}
//                                     />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </div>
//                     ) : (
//                         <p style={{ color: "yellow" }}>Нет данных для отображения графика</p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;



// const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history`);



// import React, { useState } from "react";
// import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//     const [symbol, setSymbol] = useState("");
//     const [stock, setStock] = useState(null);
//     const [history, setHistory] = useState([]);
//     const [error, setError] = useState("");

//     const fetchStockData = async () => {
//         setError("");
//         setStock(null);
//         setHistory([]);

//         if (!symbol.trim()) {
//             setError("Введите тикер акции!");
//             return;
//         }

//         try {
//             const stockResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}`);
//             setStock(stockResponse.data);

//             const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history`);
//             const formattedData = Object.entries(historyResponse.data.history).map(([date, price]) => ({
//                 date,
//                 price
//             }));

//             setHistory(formattedData);
//         } catch (err) {
//             setError("Акция не найдена");
//         }
//     };

//     return (
//         <div>
//             <h2>Поиск акций</h2>
//             <input 
//                 type="text" 
//                 value={symbol} 
//                 onChange={(e) => setSymbol(e.target.value)}
//                 placeholder="Введите тикер (например, AAPL)"
//             />
//             <button onClick={fetchStockData}>Найти</button>

//             {error && <p style={{ color: "red" }}>{error}</p>}

//             {stock && (
//                 <div>
//                     <p>{stock.symbol}: ${stock.price}</p>

//                     <h3>Историческая цена</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <LineChart data={history}>
//                             <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
//                             <YAxis domain={["auto", "auto"]} />
//                             <Tooltip />
//                             <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
//                             <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;












// import React, { useState } from "react";
// import axios from "axios";

// const Dashboard = () => {
//     const [symbol, setSymbol] = useState("");
//     const [stock, setStock] = useState(null);
//     const [error, setError] = useState("");

//     const fetchStockPrice = async () => {
//         setError("");
//         setStock(null);

//         if (!symbol.trim()) {
//             setError("Введите тикер акции!");
//             return;
//         }

//         try {
//             const response = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}`);
//             setStock(response.data);
//         } catch (err) {
//             setError("Акция не найдена");
//         }
//     };

//     return (
//         <div>
//             <h2>Поиск акций</h2>
//             <input 
//                 type="text" 
//                 value={symbol} 
//                 onChange={(e) => setSymbol(e.target.value)}
//                 placeholder="Введите тикер (например, AAPL)"
//             />
//             <button onClick={fetchStockPrice}>Найти</button>

//             {error && <p style={{ color: "red" }}>{error}</p>}

//             {stock && (
//                 <p>{stock.symbol}: ${stock.price}</p>
//             )}
//         </div>
//     );
// };

// export default Dashboard;





// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Dashboard = () => {
//     const [stock, setStock] = useState(null);

//     useEffect(() => {
//         axios.get("http://127.0.0.1:8000/stock/AAPL")
//             .then(response => setStock(response.data))
//             .catch(error => console.error("Ошибка загрузки:", error));
//     }, []);

//     return (
//         <div>
//             <h2>Данные по акции AAPL</h2>
//             {stock ? (
//                 <p>{stock.symbol}: ${stock.price}</p>
//             ) : (
//                 <p>Загрузка...</p>
//             )}
//         </div>
//     );
// };

// export default Dashboard;




// import React, { useState, useEffect } from "react";
// import { getStockData } from "../api";

// const Dashboard = () => {
//   const [stockData, setStockData] = useState(null);

//   useEffect(() => {
//     getStockData("AAPL").then(data => {
//       setStockData(data);
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Stock Dashboard</h1>
//       {stockData ? (
//         <pre>{JSON.stringify(stockData, null, 2)}</pre>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
