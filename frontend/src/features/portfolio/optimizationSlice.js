import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const optimizePortfolio = createAsyncThunk(
  'optimization/optimizePortfolio',
  async (id) => {
    const response = await axios.post(`/api/portfolios/${id}/optimize`);
    return response.data;
  }
);

const optimizationSlice = createSlice({
  name: 'optimization',
  initialState: {
    result: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOptimization: (state) => {
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(optimizePortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(optimizePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(optimizePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearOptimization } = optimizationSlice.actions;

export default optimizationSlice.reducer;
