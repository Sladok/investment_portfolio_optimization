import React from "react";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");

  // Данные пользователя (Можно получать с API)
  const user = {
    name: userEmail
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен
    navigate("/login"); // Перенаправляем на страницу входа
  };

  return (
    <div style={styles.container}>
      <h2>Мой аккаунт</h2>
      <div style={styles.infoBox}>
        <p><strong>Mail:</strong> {user.name}</p>
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Выйти из аккаунта
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
  },
  infoBox: {
    textAlign: "left",
    marginBottom: "20px",
  },
  logoutButton: {
    backgroundColor: "#ff4c4c",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default AccountPage;
