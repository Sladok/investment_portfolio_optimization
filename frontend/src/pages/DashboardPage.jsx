import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar"; // если используете
import RealTimeStockChart from "../components/RealTimeStockChart"; // ваш компонент графика
import Dashboard from "../components/Dashboard"

const DashboardPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", marginTop: "20px" }}>
        {/* Если используете Sidebar, он будет слева */}
        <Sidebar />
        <main style={{ flex: 1, padding: "20px", boxSizing: "border-box", textAlign: "center" }}>
          {/* <RealTimeStockChart symbol="AAPL" /> */}
           <Dashboard defaultSymbol="AAPL" />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import RealTimeStockChart from "../components/RealTimeStockChart";
// import Dashboard from "../components/Dashboard"
// const DashboardPage = () => {
//   const navigate = useNavigate();

//   // Функция для выхода из аккаунта
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Удаляем токен
//     navigate("/login");               // Перенаправляем на страницу входа
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: "50px",
//         padding: "0 20px"
//       }}
//     >
//       <header
//         style={{
//           width: "100%",
//           maxWidth: "1200px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "20px"
//         }}
//       >
//         <h1 style={{ margin: 0 }}>Портфель инвестора</h1>
//         <button
//           onClick={handleLogout}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             backgroundColor: "red",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer"
//           }}
//         >
//           Выйти
//         </button>
//       </header>
//       <section
//         style={{
//           width: "100%",
//           maxWidth: "1200px",
//           textAlign: "center"
//         }}
//       >
//         <h2>График акций AAPL в реальном времени</h2>
//         <Dashboard symbol="AAPL" />
//       </section>
//     </div>
//   );
// };

// export default DashboardPage;
