import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Загрузка графика
export const fetchChartData = createAsyncThunk(
  "dashboard/fetchChartData",
  async (ticker, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:8000/stock/${ticker}/candlestick?n_bars=2000`
      );
      const data = await res.json();

      if (!data.candles) {
        return rejectWithValue("Нет данных для графика");
      }

      return data.candles.map((c) => ({
        time: new Date(c.datetime).getTime() / 1000,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
    } catch (err) {
      return rejectWithValue("Ошибка загрузки данных");
    }
  }
);

// Загрузка тикеров
export const searchTickers = createAsyncThunk(
  "dashboard/searchTickers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8000/tickers/search?query=${query}`);
      const data = await res.json();

      return data.map((item) => ({
        label: `${item.ticker} — ${item.name}`,
        value: item.ticker,
      }));
    } catch (err) {
      return rejectWithValue("Ошибка загрузки тикеров");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    symbol: "AAPL",
    data: [],
    loading: false,
    error: "",
  },
  reducers: {
    setSymbol(state, action) {
      state.symbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setSymbol } = dashboardSlice.actions;
export default dashboardSlice.reducer;
