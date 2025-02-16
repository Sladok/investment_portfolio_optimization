import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token"); // Проверяем, авторизован ли пользователь
  const userEmail = localStorage.getItem("email");

  return (
    <header
      style={{
        width: "100%",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        InvestNavigator
      </div>
      <nav>
        {token ? (
          <Link to="/account" style={{ color: "#fff", textDecoration: "none" }}>
            {userEmail}
          </Link>
        ) : (
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
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
//         <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
//           Login
//         </Link>
//       </nav>
//     </header>
//   );
// };

// export default Header;
