import React, { useState, useEffect } from "react";
import { getStockData } from "../api";

const Dashboard = () => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    getStockData("AAPL").then(data => {
      setStockData(data);
    });
  }, []);

  return (
    <div>
      <h1>Stock Dashboard</h1>
      {stockData ? (
        <pre>{JSON.stringify(stockData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
