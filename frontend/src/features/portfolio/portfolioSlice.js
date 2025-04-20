import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPortfolios, deletePortfolio, createPortfolio, getAllPortfolios } from "../../api/portfolio";

export const fetchPortfolios = createAsyncThunk(
  "portfolio/fetchPortfolios",
  async (_, thunkAPI) => {
    try {
      const data = await getPortfolios();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllPortfolios = createAsyncThunk(
  "portfolio/fetchAllPortfolios",
  async (_, thunkAPI) => {
    try {
      const data = await getAllPortfolios();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removePortfolio = createAsyncThunk(
  "portfolio/removePortfolio",
  async (id, thunkAPI) => {
    try {
      await deletePortfolio(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createPortfolioAsync = createAsyncThunk(
  "portfolio/createPortfolio",
  async (data, thunkAPI) => {
    try {
      const response = await createPortfolio(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState: {
    items: [],
    loading: false,
    error: null,
    allItems: [],          // ← все портфели всех пользователей
    allLoading: false,
    allError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllPortfolios.pending, (state) => {
        state.allLoading = true;
        state.allError = null;
      })
      .addCase(fetchAllPortfolios.fulfilled, (state, action) => {
        state.allLoading = false;
        state.allItems = action.payload;
      })
      .addCase(fetchAllPortfolios.rejected, (state, action) => {
        state.allLoading = false;
        state.allError = action.payload;
      })
      
      .addCase(removePortfolio.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export default portfolioSlice.reducer;