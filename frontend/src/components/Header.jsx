import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
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
        <Link to="/" style={{ color: "#fff", marginRight: "15px", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/dashboard" style={{ color: "#fff", marginRight: "15px", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
