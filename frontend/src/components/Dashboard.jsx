import React, { useEffect, useState } from "react";
import CandleChart from "./CandleChart";
import Spinner from "../components/Spinner";
import AsyncSelect from "react-select/async";

const Dashboard = ({ defaultSymbol = "AAPL" }) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    label: "AAPL — Apple Inc.",
    value: "AAPL",
  });

  const fetchData = async (ticker = symbol) => {
    setError("");
    setData([]);
    setLoading(true);

    if (!ticker.trim()) {
      setError("Введите тикер акции!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/stock/${ticker.toUpperCase()}/candlestick?n_bars=2000`
      );
      const result = await response.json();

      if (result.candles) {
        const formattedData = result.candles.map((candle) => ({
          time: new Date(candle.datetime).getTime() / 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
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

  useEffect(() => {
    fetchData("AAPL");
  }, []);

  return (
    <div className="flex flex-col items-center text-white p-6 bg-[#1E1E1E] rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold mb-4">График акций</h2>

      <div className="flex space-x-4 mb-4 w-full max-w-md">
        <div className="flex-1">
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions={false}
            value={selectedOption}
            inputValue={inputValue}
            onInputChange={(value, { action }) => {
              if (action !== "menu-close") setInputValue(value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(selected) => {
              if (selected) {
                setSymbol(selected.value);
                setSelectedOption(selected);
                setInputValue("");
                fetchData(selected.value);
              }
            }}
            placeholder="Поиск тикера..."
            className="text-black"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#1E1E1E" : "#121212",
                borderColor: "#4C1D95",
                color: "white",
                zIndex: 50,
                transition: "background-color 0.3s ease-in-out",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#aaa",
              }),
              singleValue: (base) => ({
                ...base,
                color:
                  inputValue !== ""
                    ? "transparent"
                    : isFocused
                    ? "#aaa"
                    : "white",
                transition: "color 0.3s ease-in-out",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#121212",
                zIndex: 9999,
                animation: "fadeIn 0.2s ease-in-out",
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#4C1D95" : "#121212",
                color: "white",
                transition: "background-color 0.2s ease",
              }),
            }}
            menuPortalTarget={document.body}
          />
        </div>
        <button
          onClick={() => {
            if (selectedOption) {
              fetchData(selectedOption.value);
            }
          }}
          className="px-4 py-2 bg-[#4C1D95] hover:bg-[#3B0D7B] active:scale-95 active:bg-[#2E0854] text-white rounded-md transition transform duration-150"
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
// import Spinner from "../components/Spinner";
// import AsyncSelect from "react-select/async";

// const Dashboard = ({ defaultSymbol = "AAPL" }) => {
//   const [symbol, setSymbol] = useState(defaultSymbol);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedOption, setSelectedOption] = useState({
//     label: "AAPL — Apple Inc.",
//     value: "AAPL",
//   });

//   const fetchData = async () => {
//     setError("");
//     setData([]);
//     setLoading(true);

//     if (!symbol.trim()) {
//       setError("Введите тикер акции!");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8000/stock/${symbol.toUpperCase()}/candlestick?n_bars=2000`
//       );
//       const result = await response.json();

//       if (result.candles) {
//         const formattedData = result.candles.map((candle) => ({
//           time: new Date(candle.datetime).getTime() / 1000,
//           open: candle.open,
//           high: candle.high,
//           low: candle.low,
//           close: candle.close,
//         }));
//         setData(formattedData);
//       } else {
//         setError("Нет данных для графика!");
//       }
//     } catch (error) {
//       setError("Ошибка: Акция не найдена или сервер недоступен");
//     } finally {
//       setLoading(false);
//     }
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

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && symbol) {
//       fetchData();
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     setSelectedOption({
//       label: "AAPL — Apple Inc.",
//       value: "AAPL",
//     });
//   }, []);

//   return (
//     <div className="flex flex-col items-center text-white p-6 bg-[#1E1E1E] rounded-lg shadow-lg w-full">
//       <h2 className="text-2xl font-semibold mb-4">График акций</h2>

//       <div className="flex space-x-4 mb-4 w-full max-w-md">
//         <div className="flex-1">
//           <AsyncSelect
//             cacheOptions
//             loadOptions={loadOptions}
//             defaultOptions={false}
//             value={selectedOption}
//             inputValue={inputValue}
//             onInputChange={(value, { action }) => {
//               if (action !== "menu-close") setInputValue(value);
//             }}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//             onKeyDown={handleKeyDown}
//             onChange={(selected) => {
//               if (selected) {
//                 setSymbol(selected.value);
//                 setSelectedOption(selected);
//                 setInputValue("");
//                 fetchData();
//               }
//             }}
//             placeholder="Поиск тикера..."
//             className="text-black"
//             styles={{
//               control: (base, state) => ({
//                 ...base,
//                 backgroundColor: state.isFocused ? "#1E1E1E" : "#121212",
//                 borderColor: "#4C1D95",
//                 color: "white",
//                 zIndex: 50,
//                 transition: "background-color 0.3s ease-in-out",
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: "white",
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: "#aaa",
//               }),
//               singleValue: (base) => ({
//                 ...base,
//                 color:
//                   inputValue !== ""
//                     ? "transparent"
//                     : isFocused
//                     ? "#aaa"
//                     : "white",
//                 transition: "color 0.3s ease-in-out",
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: "#121212",
//                 zIndex: 9999,
//                 animation: "fadeIn 0.2s ease-in-out",
//               }),
//               menuPortal: (base) => ({
//                 ...base,
//                 zIndex: 9999,
//               }),
//               option: (base, state) => ({
//                 ...base,
//                 backgroundColor: state.isFocused ? "#4C1D95" : "#121212",
//                 color: "white",
//                 transition: "background-color 0.2s ease",
//               }),
//             }}
//             menuPortalTarget={document.body}
//           />
//         </div>
//         <button
//           onClick={fetchData}
//           className="px-4 py-2 bg-[#4C1D95] hover:bg-[#3B0D7B] active:scale-95 active:bg-[#2E0854] text-white rounded-md transition transform duration-150"
//         >
//           Найти
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       {loading ? (
//         <Spinner />
//       ) : (
//         <div className="w-full h-[500px] mt-4">
//           {data.length > 0 ? (
//             <CandleChart data={data} />
//           ) : (
//             <p className="text-yellow-400">Нет данных</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



// import React, { useEffect, useState } from "react";
// import CandleChart from "./CandleChart";
// import Spinner from "../components/Spinner";
// import AsyncSelect from "react-select/async";

// const Dashboard = ({ defaultSymbol = "AAPL" }) => {
//   const [symbol, setSymbol] = useState(defaultSymbol);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [isFocused, setIsFocused] = useState(false); // следим за фокусом

//   const fetchData = async () => {
//     setError("");
//     setData([]);
//     setLoading(true);

//     if (!symbol.trim()) {
//       setError("Введите тикер акции!");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8000/stock/${symbol.toUpperCase()}/candlestick?n_bars=2000`
//       );
//       const result = await response.json();

//       if (result.candles) {
//         const formattedData = result.candles.map((candle) => ({
//           time: new Date(candle.datetime).getTime() / 1000,
//           open: candle.open,
//           high: candle.high,
//           low: candle.low,
//           close: candle.close,
//         }));
//         setData(formattedData);
//       } else {
//         setError("Нет данных для графика!");
//       }
//     } catch (error) {
//       setError("Ошибка: Акция не найдена или сервер недоступен");
//     } finally {
//       setLoading(false);
//     }
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

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && symbol) {
//       fetchData();
//     }
//   };
  
//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="flex flex-col items-center text-white p-6 bg-[#1E1E1E] rounded-lg shadow-lg w-full">
//       <h2 className="text-2xl font-semibold mb-4">График акций</h2>

//       <div className="flex space-x-4 mb-4 w-full max-w-md">
//         <div className="flex-1">
//           <AsyncSelect
//             cacheOptions
//             loadOptions={loadOptions}
//             defaultOptions={false}
//             inputValue={inputValue}
//             onInputChange={(value, { action }) => {
//               if (action !== "menu-close") setInputValue(value);
//             }}
//             onFocus={() => setIsFocused(true)}
//             onBlur={() => setIsFocused(false)}
//             onKeyDown={handleKeyDown}
//             onChange={(selected) => {
//               if (selected) {
//                 setSymbol(selected.value);
//                 setInputValue(""); // очистим поле ввода
//                 fetchData();
//               }
//             }}
//             placeholder="Поиск тикера..."
//             className="text-black"
//             styles={{
//               control: (base, state) => ({
//                 ...base,
//                 backgroundColor: state.isFocused ? "#1E1E1E" : "#121212",
//                 borderColor: "#4C1D95",
//                 color: "white",
//                 zIndex: 50,
//                 transition: "background-color 0.3s ease-in-out",
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: "white",
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: "#aaa",
//               }),
//               singleValue: (base) => ({
//                 ...base,
//                 color:
//                   inputValue !== ""
//                     ? "transparent"
//                     : isFocused
//                     ? "#aaa"
//                     : "white",
//                 transition: "color 0.3s ease-in-out",
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: "#121212",
//                 zIndex: 9999,
//                 animation: "fadeIn 0.2s ease-in-out",
//               }),
//               menuPortal: (base) => ({
//                 ...base,
//                 zIndex: 9999,
//               }),
//               option: (base, state) => ({
//                 ...base,
//                 backgroundColor: state.isFocused ? "#4C1D95" : "#121212",
//                 color: "white",
//                 transition: "background-color 0.2s ease",
//               }),
//             }}
//             menuPortalTarget={document.body}
//           />
//         </div>
//         <button
//           onClick={fetchData}
//           className="px-4 py-2 bg-[#4C1D95] hover:bg-[#3B0D7B] active:scale-95 active:bg-[#2E0854] text-white rounded-md transition transform duration-150"
//         >
//           Найти
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       {loading ? (
//         <Spinner />
//       ) : (
//         <div className="w-full h-[500px] mt-4">
//           {data.length > 0 ? (
//             <CandleChart data={data} />
//           ) : (
//             <p className="text-yellow-400">Нет данных</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;