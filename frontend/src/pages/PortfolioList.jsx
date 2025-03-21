import { useEffect, useState } from "react";
import { getPortfolios, deletePortfolio } from "../api/portfolio";
import { useNavigate } from "react-router-dom";

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

  if (error) {
    return <div className="text-red-500 text-center mt-5">Ошибка: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">Мои портфели</h2>
      <button onClick={() => navigate("/create-portfolio")} className="bg-green-500 text-white p-2 rounded mb-4">
        + Создать новый
      </button>
      {portfolios.length === 0 ? (
        <p className="text-gray-500">Нет портфелей</p>
      ) : (
        <ul>
          {portfolios.map((portfolio) => (
            <li key={portfolio.id} className="border p-3 mb-2 flex justify-between">
              <div>
                <h3 className="font-bold">{portfolio.name}</h3>
                <p>Акции: {portfolio.stocks.join(", ")}</p>
              </div>
              <button onClick={() => handleDelete(portfolio.id)} className="bg-red-500 text-white p-2 rounded">
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PortfolioList;
