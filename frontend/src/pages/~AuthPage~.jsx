import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // переключение между входом и регистрацией
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, {
        email,
        password,
      });
      setToken(response.data.access_token);
      localStorage.setItem("token", response.data.access_token);  // сохраняем токен
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "10px 0" }}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "10px 0" }}
          required
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setError("");
        }}
        style={{ marginTop: "10px" }}
      >
        {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
      </button>
      {token && (
        <div>
          <h3>Ваш токен:</h3>
          <p>{token}</p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
