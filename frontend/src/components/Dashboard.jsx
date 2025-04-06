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
            const response = await fetch(`http://localhost:8000/stock/${symbol.toUpperCase()}/candlestick?n_bars=2000`);
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
                    className="px-4 py-2 bg-[#4C1D95] hover:bg-[#3B0D7B] text-white rounded-md hover:bg-purple-800 transition"
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