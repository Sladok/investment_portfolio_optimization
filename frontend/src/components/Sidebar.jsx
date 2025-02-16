import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      style={{
        width: "200px",
        backgroundColor: "#1a1a1a",
        color: "#b39ddb",
        padding: "20px",
        boxSizing: "border-box",
        minHeight: "calc(100vh - 60px)", // если Header имеет высоту ~60px
      }}
    >
      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/dashboard" style={{ textDecoration: "none", color: "#fff" }}>
              Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/portfolio" style={{ textDecoration: "none", color: "#fff" }}>
              Portfolio
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/news" style={{ textDecoration: "none", color: "#fff" }}>
              News
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link to="/settings" style={{ textDecoration: "none", color: "#fff" }}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
