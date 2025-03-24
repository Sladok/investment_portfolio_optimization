import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка входа");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F19] text-[#D1D5DB]">
      <Helmet>
        <title>InvestNavigator - Вход</title>
        <meta name="description" content={`Вход в аккаунт`} />
      </Helmet>
      
      <Header />

      {/* Контейнер формы */}
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-[#1A1A2E] shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-[#8B5CF6]">
            Вход
          </h2>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-[#252540] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#4C1D95] outline-none transition"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-[#252540] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-[#4C1D95] outline-none transition"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#4C1D95] hover:bg-[#3B0D7B] text-white font-semibold p-3 rounded-md transition"
            >
              Войти
            </motion.button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-[#8B5CF6] hover:underline">
              Зарегистрируйтесь
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import Header from "../components/Header";
// import { motion } from "framer-motion";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/auth/login", {
//         email,
//         password,
//       });
//       localStorage.setItem("token", response.data.access_token);
//       localStorage.setItem("email", email);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.detail || "Ошибка входа");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-900 text-white">
//       <Header />

//       {/* Контейнер формы */}
//       <div className="flex-grow flex items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md p-8 bg-gray-800 shadow-lg rounded-lg"
//         >
//           <h2 className="text-2xl font-bold text-center mb-6">Вход</h2>

//           {error && (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-red-500 text-center mb-4"
//             >
//               {error}
//             </motion.p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition"
//             />
//             <input
//               type="password"
//               placeholder="Пароль"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition"
//             />
//             <motion.button
//               type="submit"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-md transition"
//             >
//               Войти
//             </motion.button>
//           </form>

//           <p className="text-center mt-6 text-gray-400">
//             Нет аккаунта?{" "}
//             <Link to="/register" className="text-blue-400 hover:underline">
//               Зарегистрируйтесь
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
