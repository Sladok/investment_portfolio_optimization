import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChartData,
  searchTickers,
  setSymbol,
} from "../features/charts/dashboardSlice";
import CandleChart from "./CandleChart";
import Spinner from "./Spinner";
import AsyncSelect from "react-select/async";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { symbol, data, loading, error } = useSelector((state) => state.dashboard);

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    label: "AAPL — Apple Inc.",
    value: "AAPL",
  });

  const loadOptions = async (input, callback) => {
    if (!input || input.length < 1) return callback([]);
    try {
      const options = await dispatch(searchTickers(input)).unwrap();
      callback(options);
    } catch {
      callback([]);
    }
  };

  useEffect(() => {
    dispatch(fetchChartData("AAPL"));
  }, [dispatch]);

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
                setSelectedOption(selected);
                dispatch(setSymbol(selected.value));
                dispatch(fetchChartData(selected.value));
              }
            }}
            placeholder="Поиск тикера..."
            className="text-black"
            menuPortalTarget={document.body}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#1E1E1E" : "#121212",
                borderColor: "#4C1D95",
                color: "white",
              }),
              input: (base) => ({ ...base, color: "white" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              singleValue: (base) => ({
                ...base,
                color:
                  inputValue !== ""
                    ? "transparent"
                    : isFocused
                    ? "#aaa"
                    : "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#121212",
                zIndex: 9999,
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#4C1D95" : "#121212",
                color: "white",
              }),
            }}
          />
        </div>
        <button
          onClick={() => {
            dispatch(fetchChartData(symbol));
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