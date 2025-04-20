import { useEffect, useState } from "react";
import { getAllPortfolios, deletePortfolio } from "../api/portfolio";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";

const AllPortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getAllPortfolios();
        if (Array.isArray(data)) {
          setPortfolios(data);
        } else {
          throw new Error("Ответ API не является массивом");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      <Helmet>
        <title>InvestNavigator - Все портфели</title>
        <meta name="description" content="Все портфели пользователей" />
      </Helmet>

      <Header />

      <div className="max-w-5xl mx-auto p-6 mt-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-6 text-[#A78BFA]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Все портфели пользователей
        </motion.h2>

        {error && (
          <motion.div
            className="text-red-500 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Ошибка: {error}
          </motion.div>
        )}

        {portfolios.length === 0 ? (
          <p className="text-gray-400 text-center">Нет портфелей</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {portfolios.map((portfolio) => (
              <motion.div
                key={portfolio.id}
                className="w-full bg-gradient-to-r from-[#1E1E30] to-[#2A2A40] p-12 rounded-xl shadow-lg flex flex-col justify-between transition transform hover:scale-105"
                whileHover={{ scale: 1.03 }}
              >
                <div>
                  <h3 className="text-xl font-bold text-[#D8B4FE] mb-2">{portfolio.name}</h3>
                  <p className="text-gray-400 text-sm">Пользователь: {portfolio.user_email}</p>
                  <p className="text-gray-400 text-sm">
                    Акции: {Array.isArray(portfolio.stocks)
                      ? portfolio.stocks.map((stock) => `${stock.ticker} (${stock.allocation}%)`).join(", ")
                      : "Нет акций"}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Создан: {new Date(portfolio.created_at).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Обновлён: {new Date(portfolio.updated_at).toLocaleString()}
                  </p>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllPortfolioList;