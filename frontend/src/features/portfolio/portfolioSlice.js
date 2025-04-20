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



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getPortfolios,
//   deletePortfolio,
//   createPortfolio,
//   getPortfolioById,
//   updatePortfolio,
// } from "../../api/portfolio";

// // Загрузка всех портфелей
// export const fetchPortfolios = createAsyncThunk(
//   "portfolio/fetchPortfolios",
//   async (_, thunkAPI) => {
//     try {
//       const data = await getPortfolios();
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// // Загрузка одного портфеля по id
// export const fetchPortfolioById = createAsyncThunk(
//   "portfolio/fetchPortfolioById",
//   async (id, thunkAPI) => {
//     try {
//       const data = await getPortfolioById(id);
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// // Удаление портфеля
// export const removePortfolio = createAsyncThunk(
//   "portfolio/removePortfolio",
//   async (id, thunkAPI) => {
//     try {
//       await deletePortfolio(id);
//       return id;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// // Создание нового портфеля
// export const createPortfolioAsync = createAsyncThunk(
//   "portfolio/createPortfolio",
//   async (data, thunkAPI) => {
//     try {
//       const response = await createPortfolio(data);
//       return response;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// // Обновление портфеля
// export const updatePortfolioAsync = createAsyncThunk(
//   "portfolio/updatePortfolio",
//   async ({ id, data }, thunkAPI) => {
//     try {
//       const updated = await updatePortfolio(id, data);
//       return { id, data: updated };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// const portfolioSlice = createSlice({
//   name: "portfolio",
//   initialState: {
//     items: [],
//     current: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearCurrentPortfolio: (state) => {
//       state.current = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Получение всех
//       .addCase(fetchPortfolios.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPortfolios.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchPortfolios.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Получение по ID
//       .addCase(fetchPortfolioById.fulfilled, (state, action) => {
//         state.current = action.payload;
//       })

//       // Удаление
//       .addCase(removePortfolio.fulfilled, (state, action) => {
//         state.items = state.items.filter((p) => p.id !== action.payload);
//       })

//       // Создание
//       .addCase(createPortfolioAsync.fulfilled, (state, action) => {
//         state.items.push(action.payload);
//       })

//       // Обновление
//       .addCase(updatePortfolioAsync.fulfilled, (state, action) => {
//         const index = state.items.findIndex(
//           (p) => p.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.items[index] = {
//             ...state.items[index],
//             ...action.payload.data,
//           };
//         }

//         if (state.current?.id === action.payload.id) {
//           state.current = {
//             ...state.current,
//             ...action.payload.data,
//           };
//         }
//       });
//   },
// });

// export const { clearCurrentPortfolio } = portfolioSlice.actions;
// export default portfolioSlice.reducer;