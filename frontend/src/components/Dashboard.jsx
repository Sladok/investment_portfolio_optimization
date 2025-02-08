import React, { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const [symbol, setSymbol] = useState("");
    const [stock, setStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

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
            setStock(stockResponse.data);

            const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history`);
            const formattedData = Object.entries(historyResponse.data.history).map(([date, price]) => ({
                date,
                price
            }));

            setHistory(formattedData);
        } catch (err) {
            setError("Акция не найдена");
        }
    };

    return (
        <div>
            <h2>Поиск акций</h2>
            <input 
                type="text" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Введите тикер (например, AAPL)"
            />
            <button onClick={fetchStockData}>Найти</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {stock && (
                <div>
                    <p>{stock.symbol}: ${stock.price}</p>

                    <h3>Историческая цена</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={history}>
                            <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} />
                            <YAxis domain={["auto", "auto"]} />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Dashboard;












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
