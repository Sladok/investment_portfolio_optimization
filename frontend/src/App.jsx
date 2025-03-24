import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import PortfolioList from "./pages/PortfolioList";
import CreatePortfolio from "./pages/CreatePortfolio";

function App() {
  return (
    <HelmetProvider>
      
      <Helmet>
        <title>InvestNavigator</title>
        <meta name="description" content="Платформа для управления инвестиционными портфелями." />
        <link rel="icon" type="image/ico" href="/favicon.ico" />
      </Helmet>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/portfolios" element={<PortfolioList />} />
          <Route path="/create-portfolio" element={<CreatePortfolio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
