import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

  return (
    <header className="w-full px-6 py-4 bg-[#333] text-white flex justify-between items-center">
      {/* Логотип с анимацией */}
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-wide cursor-pointer transition-all duration-300 hover:scale-105"
      >
        <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-400 hover:to-purple-200">
          Invest
        </span>
        <span className="text-white transition-all duration-300 hover:text-gray-300">
          Navigator
        </span>
      </Link>

      {/* Навигация с анимацией */}
      <nav >
        {token ? (
          <Link
            to="/account"
            className="text-white text-xl relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            {userEmail}
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-white text-xl relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;


// import React from "react";
// import { Link } from "react-router-dom";

// const Header = () => {
//   const token = localStorage.getItem("token");
//   const userEmail = localStorage.getItem("email");

//   return (
//     <header className="w-full px-6 py-4 bg-[#333] text-white flex justify-between items-center">
//       {/* Логотип */}
//       <Link to="/" className="text-2xl font-extrabold tracking-wide cursor-pointer">
//         <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
//           Invest
//         </span>
//         <span className="text-white">Navigator</span>
//       </Link>

//       {/* Навигация */}
//       <nav>
//         {token ? (
//           <Link to="/account" className="text-white text-lg hover:underline">
//             {userEmail}
//           </Link>
//         ) : (
//           <Link to="/login" className="text-white text-lg hover:underline">
//             Login
//           </Link>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;



// import React from "react";
// import { Link } from "react-router-dom";

// const Header = () => {
//   const token = localStorage.getItem("token"); // Проверяем, авторизован ли пользователь
//   const userEmail = localStorage.getItem("email");

//   return (
//     <header
//       style={{
//         width: "100%",
//         padding: "10px 20px",
//         backgroundColor: "#333",
//         color: "#fff",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         boxSizing: "border-box",
//       }}
//     >
//       <div style={{ fontSize: "24px", fontWeight: "bold" }}>
//         InvestNavigator
//       </div>
//       <nav>
//         {token ? (
//           <Link to="/account" style={{ color: "#fff", textDecoration: "none" }}>
//             {userEmail}
//           </Link>
//         ) : (
//           <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
//             Login
//           </Link>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;
