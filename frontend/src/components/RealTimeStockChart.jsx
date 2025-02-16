import React, { useEffect, useState } from "react";

const RealTimeStockChart = ({ symbol }) => {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/stock/${symbol}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error("Error from WebSocket:", data.error);
        return;
      }
      setPrice(data.price);
      setChange(data.change);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [symbol]);

  return (
    <div>
      <h2>Stock: {symbol}</h2>
      <p>Price: {price !== null ? `$${price}` : "Loading..."}</p>
      <p style={{ color: change >= 0 ? "green" : "red" }}>
        Change: {change !== null ? `${change}` : "Loading..."}
      </p>
    </div>
  );
};

export default RealTimeStockChart;

// import React, { useEffect, useState, useRef } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// const RealTimeStockChart = () => {
//     const [data, setData] = useState([]);
//     const ws = useRef(null);

//     useEffect(() => {
//         ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/stock/${symbol}`);

//         ws.current.onmessage = (event) => {
//             const newPoint = JSON.parse(event.data);
//             setData((prevData) => [...prevData.slice(-50), { time: new Date().toLocaleTimeString(), price: newPoint.price }]);
//         };

//         return () => ws.current.close();
//     }, []);

//     return (
//         <div>
//             <h2>Real-time AAPL Stock Price</h2>
//             <LineChart width={600} height={300} data={data}>
//                 <XAxis dataKey="time" />
//                 <YAxis domain={["auto", "auto"]} />
//                 <Tooltip />
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Line type="monotone" dataKey="price" stroke="#8884d8" />
//             </LineChart>
//         </div>
//     );
// };

// export default RealTimeStockChart;

// import React, { useEffect, useState } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// const RealTimeStockChart = ({ symbol }) => {
//   const [data, setData] = useState([]);
//   const [price, setPrice] = useState(null);
//   const [color, setColor] = useState("green");

//   useEffect(() => {
//     const ws = new WebSocket(`ws://127.0.0.1:8000/ws/stock/${symbol}`);

//     ws.onmessage = (event) => {
//       const stockData = JSON.parse(event.data);
//       if (stockData.price !== null) {
//         setPrice(stockData.price);
//         setColor(stockData.price > (data[data.length - 1]?.price || 0) ? "green" : "red");

//         setData((prevData) => [
//           ...prevData.slice(-50), // Храним только 50 последних значений
//           { time: new Date().toLocaleTimeString(), price: stockData.price }
//         ]);
//       }
//     };

//     ws.onerror = (error) => console.error("WebSocket error:", error);
//     ws.onclose = () => console.log("WebSocket connection closed");

//     return () => ws.close();
//   }, [symbol]);

//   return (
//     <div>
//       <h2>Реальное обновление цены акции</h2>
//       <h3 style={{ color }}>{symbol}: {price !== null ? `$${price.toFixed(2)}` : "Нет данных"}</h3>

//       <LineChart width={600} height={300} data={data}>
//         <XAxis dataKey="time" />
//         <YAxis domain={["auto", "auto"]} />
//         <Tooltip />
//         <CartesianGrid strokeDasharray="3 3" />
//         <Line type="monotone" dataKey="price" stroke={color} dot={false} />
//       </LineChart>
//     </div>
//   );
// };

// export default RealTimeStockChart;



// import React, { useEffect, useState, useRef } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// const RealTimeStockChart = ({ ticker }) => {
//   const [data, setData] = useState([]);
//   const [lastPrice, setLastPrice] = useState(null);
//   const ws = useRef(null);

//   useEffect(() => {
//     // Подключение к WebSocket
//     ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/stock/${ticker}`);

//     ws.current.onmessage = (event) => {
//       const price = JSON.parse(event.data).price;
//       const timestamp = new Date().toLocaleTimeString();

//       setData((prevData) => [
//         ...prevData.slice(-20), // Храним только 20 последних значений
//         { time: timestamp, price: price },
//       ]);
//       setLastPrice(price);
//     };

//     ws.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     ws.current.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     return () => {
//       ws.current.close();
//     };
//   }, [ticker]);

//   return (
//     <div>
//       <h2>График цены {ticker} в реальном времени</h2>
//       <LineChart width={600} height={300} data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="time" />
//         <YAxis domain={["auto", "auto"]} />
//         <Tooltip />
//         <Line
//           type="monotone"
//           dataKey="price"
//           stroke={lastPrice && data.length > 1 && lastPrice > data[data.length - 2]?.price ? "green" : "red"}
//           dot={false}
//         />
//       </LineChart>
//     </div>
//   );
// };

// export default RealTimeStockChart;


// import { useEffect, useState } from "react";

// function RealTimeStockChart() {
//     const [price, setPrice] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const ws = new WebSocket("ws://127.0.0.1:8000");

//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             setPrice(data.price);
//         };

//         ws.onerror = (event) => {
//             console.error("WebSocket error:", event);
//             setError("Ошибка WebSocket");
//         };

//         ws.onclose = () => {
//             console.warn("WebSocket connection closed");
//         };

//         return () => ws.close();
//     }, []);

//     return (
//         <div>
//             <h1>Цена акции AAPL в реальном времени</h1>
//             {error ? <p style={{ color: "red" }}>{error}</p> : <h2>{price ? `$${price}` : "Загрузка..."}</h2>}
//         </div>
//     );
// }

// export default RealTimeStockChart;


// import React, { useState, useEffect, useRef } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// const RealTimeStockChart = () => {
//   const [symbol, setSymbol] = useState("AAPL");
//   const [stock, setStock] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [error, setError] = useState("");
//   const ws = useRef(null);

//   // Функция для выбора цвета точки (если цена растет — зеленый, падает — красный)
//   const getDotColor = (change) => (change >= 0 ? "#00FF99" : "#FF0000");

//   useEffect(() => {
//     // Открываем WebSocket-соединение при загрузке компонента или смене тикера
//     // const wsUrl = `ws://127.0.0.1:8123/ws/stock/${symbol}`;
//     const wsUrl = `ws://127.0.0.1:8000/ws/stock/${symbol}`;

//     ws.current = new WebSocket(wsUrl);  

//     ws.current.onopen = () => {
//       console.log("WebSocket connection opened");
//     };

//     ws.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.error) {
//           setError(data.error);
//           return;
//         }
//         setError("");
//         setStock(data);
//         // Добавляем новую точку данных с временной меткой
//         const newPoint = {
//           date: new Date().toLocaleTimeString(),
//           price: data.price,
//           change: data.change
//         };
//         setHistory((prevHistory) => {
//           const updatedHistory = [...prevHistory, newPoint];
//           // Ограничим историю до последних 50 точек
//           if (updatedHistory.length > 50) updatedHistory.shift();
//           return updatedHistory;
//         });
//       } catch (e) {
//         console.error("Error parsing message", e);
//       }
//     };

//     ws.current.onopen = () => {
//       console.log("WebSocket connection opened");
//     };
//     ws.current.onmessage = (event) => {
//       console.log("Received data:", event.data);
//       // обработка данных...
//     };
//     ws.current.onerror = (err) => {
//       console.error("WebSocket error:", err);
//       setError("Ошибка WebSocket");
//     };
//    ws.current.onclose = () => {
//       console.log("WebSocket connection closed");
//     };
    

//     // Очистка при размонтировании
//     return () => {
//       if (ws.current) {
//         ws.current.close();
//       }
//     };
//   }, [symbol]);

//   // Функция для смены тикера (если нужно)
//   const handleSymbolChange = (e) => {
//     setSymbol(e.target.value);
//     setHistory([]); // сброс истории при смене тикера
//   };

//   return (
//     <div style={{ textAlign: "center", color: "#ffffff" }}>
//       <h2>Реальное обновление цены акции</h2>
//       <input
//         type="text"
//         value={symbol}
//         onChange={handleSymbolChange}
//         placeholder="Введите тикер (например, AAPL)"
//         style={{ padding: "8px", fontSize: "16px", marginRight: "10px", borderRadius: "5px", border: "none" }}
//       />
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {stock && (
//         <p>
//           {stock.symbol}: <strong>${stock.price}</strong> {stock.change >= 0 ? "(+)" : "(-)"}
//         </p>
//       )}
//       <h3>График цены в реальном времени</h3>
//       {history.length > 0 ? (
//         <div style={{ width: "95%", height: "500px", margin: "auto" }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={history}>
//               <XAxis
//                 dataKey="date"
//                 tick={{ fill: "#ffffff" }}
//                 // Форматируем подписи: покажем время (например, HH:MM:SS)
//               />
//               <YAxis tick={{ fill: "#ffffff" }} domain={["auto", "auto"]} />
//               <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
//               <CartesianGrid stroke="#444" strokeDasharray="5 5" />
//               <Line
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#00FF99"
//                 strokeWidth={2}
//                 dot={({ payload, cx, cy }) => (
//                   <circle cx={cx} cy={cy} r={2} fill={getDotColor(payload.change)} />
//                 )}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       ) : (
//         <p>Нет данных для отображения графика</p>
//       )}
//     </div>
//   );
// };

// export default RealTimeStockChart;
