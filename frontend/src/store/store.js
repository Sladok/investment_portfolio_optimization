import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "../features/portfolio/portfolioSlice";
import dashboardReducer from "../features/charts/dashboardSlice";
import authReducer from "../features/user/authSlice";
import optimizationReducer from "../features/portfolio/optimizationSlice";
import singlePortfolioReducer from "../features/portfolio/singlePortfolioSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    optimization: optimizationReducer,
    singlePortfolio: singlePortfolioReducer,
  },
});