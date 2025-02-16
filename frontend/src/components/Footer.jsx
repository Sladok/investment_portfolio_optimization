import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        padding: "10px 20px",
        backgroundColor: "#fffff",
        color: "#fff",
        textAlign: "center",
        marginTop: "20px",
        boxSizing: "border-box",
      }}
    >
      <p>&copy; {new Date().getFullYear()} InvestNavigator. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
