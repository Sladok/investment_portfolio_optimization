const API_URL = "http://localhost:8000";
import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated");
  return { Authorization: `Bearer ${token}` };
};

export const getPortfolios = async () => {
  try {
    const response = await fetch(`${API_URL}/portfolios/`, { 
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении портфелей");
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка API:", error);
    return [];
  }
};

export const getAllPortfolios = async () => {
  try {
    const response = await fetch(`${API_URL}/all-portfolios/`);

    if (!response.ok) {
      throw new Error("Ошибка при получении портфелей");
    }

    return response.json();
  } catch (error) {
    console.error("Ошибка API:", error);
    return [];
  }
};


export const createPortfolio = async ({ name, stocks }) => {
  try {
    const response = await fetch("http://localhost:8000/portfolios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        name,
        stocks: stocks.map(({ ticker, allocation }) => ({
          ticker,
          allocation: parseFloat(allocation),
        }))
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Ошибка API:", data);
      throw new Error(data.detail || "Ошибка при создании портфеля");
    }

    return data;
  } catch (error) {
    console.error("Ошибка API:", error);
    return null;
  }
};

export const deletePortfolio = async (portfolioId) => {
  try {
    const response = await fetch(`${API_URL}/portfolios/${portfolioId}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Ошибка при удалении портфеля");
    }
  } catch (error) {
    console.error("Ошибка API:", error);
  }
};

export const getPortfolioById = async (portfolioId) => {
  try {
      
      const token = localStorage.getItem("token");

      const response = await axios.get(`http://localhost:8000/portfolios/${portfolioId}/`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
  } catch (error) {
      console.error("Ошибка при получении портфеля:", error);
      return null;
  }
};

export const updatePortfolio = async (id, updatedData) => {
  try {
    const response = await fetch(`http://localhost:8000/portfolios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении портфеля");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Ошибка при обновлении портфеля:", error);
    return null;
  }
};