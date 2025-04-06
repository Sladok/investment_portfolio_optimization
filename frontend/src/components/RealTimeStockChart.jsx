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