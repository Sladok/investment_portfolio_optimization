import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-[#1a1a1a] text-gray-400 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} InvestNavigator. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
