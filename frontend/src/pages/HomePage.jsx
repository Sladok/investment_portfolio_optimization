import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      
      <Helmet>
        <title>InvestNavigator - Главная</title>
        <meta name="description" content="Добро пожаловать в InvestNavigator" />
      </Helmet>

      <Header />
      <div className="flex flex-1">
        <Sidebar className="w-1/4 hidden md:block" />
        <main className="flex-1 flex justify-center items-center p-5">
          <div className="w-full max-w-4xl bg-[#1E1E1E] p-5 rounded-lg shadow-lg">
            <Dashboard defaultSymbol="AAPL" />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;