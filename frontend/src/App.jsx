import React from "react";
import Dashboard from "./components/Dashboard";
import "./App.css";
import RealTimeStockChart from "./components/RealTimeStockChart";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <div className="App center">
      {/* <Dashboard /> */}
      {/* <RealTimeStockChart symbol="AAPL" /> */}
      <AuthPage />
    </div>
  );
}

export default App;