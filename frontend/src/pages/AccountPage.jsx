import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        data: { email: userEmail }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Мой аккаунт</h2>

        <div className="bg-gray-700 p-4 rounded-md mb-6">
          <p className="text-lg">
            <strong>Email:</strong> {userEmail || "Неизвестно"}
          </p>
        </div>

        <button 
          onClick={handleLogout} 
          className="w-full bg-red-500 hover:bg-red-600 hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out mb-3"
        >
          Выйти из аккаунта
        </button>

        <button 
          onClick={handleDeleteAccount} 
          className="w-full bg-red-700 hover:bg-red-800 hover:shadow-md hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out"
        >
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
};

export default AccountPage;


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

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
//       // Отправляем запрос на удаление аккаунта
//       axios.delete("http://127.0.0.1:8000/auth/delete-account", {
//         data: { email: userEmail }
//       })
      

//       // Удаляем данные из localStorage и перенаправляем на регистрацию
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
//     <div style={styles.container}>
//       <h2>Мой аккаунт</h2>
//       <div style={styles.infoBox}>
//         <p><strong>Mail:</strong> {userEmail || "Неизвестно"}</p>
//       </div>
//       <button onClick={handleLogout} style={styles.logoutButton}>
//         Выйти из аккаунта
//       </button>
//       <button onClick={handleDeleteAccount} style={styles.deleteButton}>
//         Удалить аккаунт
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     width: "400px",
//     margin: "50px auto",
//     padding: "20px",
//     backgroundColor: "#222",
//     color: "#fff",
//     borderRadius: "10px",
//     textAlign: "center",
//     boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
//   },
//   infoBox: {
//     textAlign: "left",
//     marginBottom: "20px",
//   },
//   logoutButton: {
//     backgroundColor: "#ff4c4c",
//     border: "none",
//     color: "#fff",
//     padding: "10px 15px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "0.3s",
//     marginRight: "10px",
//     width: "100%", // Растягиваем кнопку на всю ширину
//   },
//   deleteButton: {
//     backgroundColor: "#d9534f",
//     border: "none",
//     color: "#fff",
//     padding: "10px 15px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     transition: "0.3s",
//     width: "100%", // Растягиваем кнопку на всю ширину
//     display: "block", // Делаем блочным элементом
//     marginTop: "15px", // Добавляем отступ сверху
//   },
// };

// export default AccountPage;

