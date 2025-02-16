// frontend/src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import "../styles/home.css"; // Подключаем стили


const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // по вертикали
        alignItems: "center",     // по горизонтали
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#2b2b4f",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        Добро пожаловать в InvestNavigator
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "40px" }}>
        Начните оптимизировать свой инвестиционный портфель уже сегодня!
      </p>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#6a0dad",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Войти
      </button>
    </div>
  );
};

export default HomePage;
