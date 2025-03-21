const API_URL = "http://localhost:8000";

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

export const createPortfolio = async ({ name, stocks }) => {
  try {
    // console.log("Отправляем данные:", { name, stocks });  // <-- ЛОГ ДАННЫХ
    const response = await fetch("http://localhost:8000/portfolios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name, stocks })  // <-- Возможно, тут `undefined`
    });

    // console.log("Ответ сервера:", response);
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
