import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Spinner from "../components/Spinner"; // Импортируем спиннер

const Dashboard = ({ defaultSymbol = "AAPL" }) => {
    const [symbol, setSymbol] = useState(defaultSymbol);
    const [stock, setStock] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Состояние загрузки

    const themeColor = "#5f1d8f"; // Темно-фиолетовый

    const fetchStockData = async () => {
        setError("");
        setStock(null);
        setHistory([]);
        setLoading(true); // Включаем спиннер

        if (!symbol.trim()) {
            setError("Введите тикер акции!");
            setLoading(false);
            return;
        }

        try {
            const stockResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}`);
            setStock({
                ...stockResponse.data,
                price: parseFloat(stockResponse.data.price).toFixed(2)
            });

            const historyResponse = await axios.get(`http://127.0.0.1:8000/stock/${symbol.toUpperCase()}/history?period=3y`);

            const formattedData = Object.entries(historyResponse.data.history).map(([date, price]) => ({
                date: date.substring(0, 10),
                price: parseFloat(price).toFixed(2)
            }));

            if (formattedData.length === 0) {
                setError("Нет данных для графика!");
            }

            setHistory(formattedData);
        } catch (err) {
            setError("Ошибка: Акция не найдена или сервер недоступен");
        } finally {
            setLoading(false); // Выключаем спиннер
        }
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchStockData();
        }
    };

    return (
        <div style={{ textAlign: "center", color: "#ffffff" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Поиск акций</h2>

            <input 
                type="text" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={handleKeyDown}
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
                    backgroundColor: themeColor,
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Найти
            </button>

            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

            {loading ? (
                <Spinner />
            ) : stock && (
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
                                    <YAxis tick={{ fill: "#ffffff" }} domain={["auto", "auto"]} />
                                    <Tooltip 
                                        formatter={(value) => `$${value}`} 
                                        contentStyle={{ backgroundColor: "#333", color: "#fff" }} 
                                    />
                                    <CartesianGrid stroke="#444" strokeDasharray="5 5" />
                                    <Line 
                                        type="monotone" 
                                        dataKey="price" 
                                        stroke={themeColor} 
                                        strokeWidth={2} 
                                        dot={{ r: 1, fill: themeColor }} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        !error && <p style={{ color: "yellow" }}>Нет данных для графика</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;


