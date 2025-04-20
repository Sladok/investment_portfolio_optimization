import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";
import AsyncSelect from "react-select/async";
import { createPortfolioAsync } from "../features/portfolio/portfolioSlice";

const CreatePortfolio = () => {
  const [name, setName] = useState("");
  const [stocks, setStocks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.portfolio);

  const handleAllocationChange = (index, value) => {
    const newStocks = [...stocks];
    newStocks[index].allocation = parseFloat(value);
    setStocks(newStocks);
  };

  const removeStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
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
      const res = await fetch(
        `http://localhost:8000/tickers/search?query=${inputValue}`
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validStocks = stocks
      .map((s) => ({
        ticker: s.ticker.trim(),
        allocation: parseFloat(s.allocation),
      }))
      .filter((s) => s.ticker && s.allocation > 0);

    const total = validStocks.reduce((sum, s) => sum + s.allocation, 0);
    if (total !== 100) {
      alert("Сумма процентов акций должна быть ровно 100");
      return;
    }

    const data = { name, stocks: validStocks };
    const result = await dispatch(createPortfolioAsync(data));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/portfolios");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      <Helmet>
        <title>Создание портфеля</title>
      </Helmet>

      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-xl p-8 bg-[#1E1E30] shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#A78BFA]">
            Создать портфель
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Название портфеля"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#2A2A40] text-white border border-gray-700 rounded-lg"
            />

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

            <div className="space-y-2">
              {stocks.map((stock, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1 p-2 bg-[#2A2A40] text-white border border-gray-600 rounded">
                    {stock.label}
                  </div>
                  <input
                    type="number"
                    placeholder="%"
                    value={stock.allocation}
                    onChange={(e) =>
                      handleAllocationChange(index, e.target.value)
                    }
                    className="w-20 p-2 bg-[#2A2A40] border border-gray-600 rounded text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeStock(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}
            {loading && (
              <p className="text-center text-gray-400">Создание портфеля...</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-semibold p-3 rounded-lg"
              disabled={loading}
            >
              Создать
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio;