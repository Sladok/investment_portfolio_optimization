import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";

const AccountPage = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!userEmail) {
      alert("Ошибка: email пользователя не найден.");
      return;
    }

    const confirmDelete = window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо!");
    if (!confirmDelete) return;

    try {
      await axios.delete("http://127.0.0.1:8000/auth/delete-account", {
        data: { email: userEmail },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("email");
      alert("Ваш аккаунт успешно удалён.");
      navigate("/register");
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      alert("Ошибка при удалении аккаунта. Попробуйте снова.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-[#D1D5DB] flex flex-col">
      <Helmet>
        <title>InvestNavigator - {userEmail || "Аккаунт"}</title>
        <meta name="description" content={`Аккаунт пользователя ${userEmail || "неизвестный"}`} />
      </Helmet>

      <Header />

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-[#1A1A2E] shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#8B5CF6]">
            Мой аккаунт
          </h2>

          <div className="bg-[#252540] p-4 rounded-md mb-6">
            <p className="text-lg">
              <strong>Email:</strong> {userEmail || "Неизвестно"}
            </p>
          </div>

          <button
            onClick={() => navigate(`/portfolios`)}
            className="w-full bg-[#6D28D9] hover:bg-[#581C87] hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out mb-3"
          >
            Мои портфели
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-[#6D28D9] hover:bg-[#581C87] hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out mb-3"
          >
            Выйти из аккаунта
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-[#B91C1C] hover:bg-[#991B1B] hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Header from "../components/Header"; // Подключаем Header

// const AccountPage = () => {
//   const navigate = useNavigate();
//   const userEmail = localStorage.getItem("email");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("email");
//     navigate("/login");
//   };

//   const handleDeleteAccount = async () => {
//     if (!userEmail) {
//       alert("Ошибка: email пользователя не найден.");
//       return;
//     }

//     const confirmDelete = window.confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо!");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete("http://127.0.0.1:8000/auth/delete-account", {
//         data: { email: userEmail },
//       });

//       localStorage.removeItem("token");
//       localStorage.removeItem("email");
//       alert("Ваш аккаунт успешно удалён.");
//       navigate("/register");
//     } catch (error) {
//       console.error("Ошибка при удалении аккаунта:", error);
//       alert("Ошибка при удалении аккаунта. Попробуйте снова.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col">
//       {/* Header */}
//       <Header />

//       {/* Контейнер для центрирования */}
//       <div className="flex-grow flex items-center justify-center">
//         <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
//           <h2 className="text-2xl font-semibold text-center mb-6">Мой аккаунт</h2>

//           <div className="bg-gray-700 p-4 rounded-md mb-6">
//             <p className="text-lg">
//               <strong>Email:</strong> {userEmail || "Неизвестно"}
//             </p>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-500 hover:bg-red-600 hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out mb-3"
//           >
//             Выйти из аккаунта
//           </button>

//           <button
//             onClick={handleDeleteAccount}
//             className="w-full bg-red-700 hover:bg-red-800 hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out"
//           >
//             Удалить аккаунт
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountPage;
