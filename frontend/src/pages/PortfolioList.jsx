import { useEffect, useState } from "react";
import { getPortfolios, deletePortfolio } from "../api/portfolio";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { Trash2, Edit3 } from "lucide-react";

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getPortfolios();
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

  const handleDelete = async (portfolioId) => {
    await deletePortfolio(portfolioId);
    setPortfolios(portfolios.filter((p) => p.id !== portfolioId));
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex flex-col">
      <Header />

      <div className="max-w-5xl mx-auto p-6 mt-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-6 text-[#A78BFA]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Мои портфели
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

        <motion.button
          onClick={() => navigate("/create-portfolio")}
          className="w-full bg-[#8B5CF6] hover:bg-[#6D28D9] text-white p-3 rounded-lg font-semibold transition duration-300 mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Создать новый портфель
        </motion.button>

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
                  <p className="text-gray-400 text-sm">Акции: {portfolio.stocks.join(", ")}</p>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    onClick={() => navigate(`/edit-portfolio/${portfolio.id}`)}
                    className="bg-[#8B5CF6] hover:bg-[#6D28D9] text-white p-2 rounded-lg flex items-center gap-2 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 size={18} /> Редактировать
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(portfolio.id)}
                    className="bg-[#EF4444] hover:bg-[#DC2626] text-white p-2 rounded-lg flex items-center gap-2 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} /> Удалить
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PortfolioList;
