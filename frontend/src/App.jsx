import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import UserPortfolioList from "./pages/UserPortfolioList";
import CreatePortfolio from "./pages/CreatePortfolio";
import AllPortfolioList from "./pages/AllPortfolioList";
import EditPortfolio from "./pages/EditPortfolio";

function App() {
  const [portfolios, setPortfolios] = useState([]);
  
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
          <Route path="/all-portfolios" element={<AllPortfolioList />} />
          <Route path="/create-portfolio" element={<CreatePortfolio setPortfolios={setPortfolios} />} />
          <Route path="/portfolios" element={<UserPortfolioList portfolios={portfolios} setPortfolios={setPortfolios} />} />
          <Route path="/edit-portfolio/:id" element={<EditPortfolio setPortfolios={setPortfolios} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;













// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Helmet, HelmetProvider } from "react-helmet-async";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import AccountPage from "./pages/AccountPage";
// import AdminPage from "./pages/AdminPage";
// import UserPortfolioList from "./pages/UserPortfolioList";
// import CreatePortfolio from "./pages/CreatePortfolio";
// import AllPortfolioList from "./pages/AllPortfolioList";
// import EditPortfolio from "./pages/EditPortfolio";
// import { getPortfolios } from "./api/portfolio";

// function App() {
//   const [portfolios, setPortfolios] = useState([]);

//   useEffect(() => {
//     // Загружаем портфели при старте
//     const fetchPortfolios = async () => {
//       const data = await getPortfolios();
//       setPortfolios(data);
//     };

//     fetchPortfolios();
//   }, []);

//   return (
//     <HelmetProvider>
//       <Helmet>
//         <title>InvestNavigator</title>
//         <meta name="description" content="Платформа для управления инвестиционными портфелями." />
//         <link rel="icon" type="image/ico" href="/favicon.ico" />
//       </Helmet>
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/account" element={<AccountPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/admin" element={<AdminPage />} />
//           <Route path="/all-portfolios" element={<AllPortfolioList />} />
//           <Route path="/create-portfolio" element={<CreatePortfolio setPortfolios={setPortfolios} />} />
//           <Route path="/portfolios" element={<UserPortfolioList portfolios={portfolios} setPortfolios={setPortfolios} />} />
//           <Route path="/edit-portfolio/:id" element={<EditPortfolio setPortfolios={setPortfolios} />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </HelmetProvider>
//   );
// }

// export default App;


