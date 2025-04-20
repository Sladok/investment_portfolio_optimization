import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPortfolioById,
  updatePortfolio as updatePortfolioApi,
  deletePortfolio as deletePortfolioApi,
} from "../../api/portfolio";

// Получение одного портфеля по ID
export const fetchSinglePortfolio = createAsyncThunk(
  "singlePortfolio/fetch",
  async (id, thunkAPI) => {
    try {
      const data = await getPortfolioById(id);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Обновление портфеля
export const updateSinglePortfolio = createAsyncThunk(
  "singlePortfolio/update",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const data = await updatePortfolioApi(id, updatedData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Удаление портфеля
export const deleteSinglePortfolio = createAsyncThunk(
  "singlePortfolio/delete",
  async (id, thunkAPI) => {
    try {
      await deletePortfolioApi(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const singlePortfolioSlice = createSlice({
  name: "singlePortfolio",
  initialState: {
    portfolio: null,
    loading: false,
    error: null,
    updateSuccess: false,
    deleteSuccess: false,
  },
  reducers: {
    clearSinglePortfolioState: (state) => {
      state.portfolio = null;
      state.loading = false;
      state.error = null;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSinglePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.portfolio = null;
      })
      .addCase(fetchSinglePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchSinglePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSinglePortfolio.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateSinglePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolio = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateSinglePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })

      .addCase(deleteSinglePortfolio.fulfilled, (state) => {
        state.deleteSuccess = true;
        state.portfolio = null;
      });
  },
});

export const { clearSinglePortfolioState } = singlePortfolioSlice.actions;

export default singlePortfolioSlice.reducer;
