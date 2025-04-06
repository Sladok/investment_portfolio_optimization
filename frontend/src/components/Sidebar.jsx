import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Briefcase, Newspaper, Settings } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Кнопка открытия на мобильных устройствах */}
      <button
        className="fixed top-5 left-5 z-50 bg-gray-800 text-white p-2 rounded-lg md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar для десктопа (всегда виден) */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-[#1a1a1a] text-white shadow-lg p-4">
        <SidebarContent />
      </aside>

      {/* Sidebar для мобильных устройств (с анимацией) */}
      {isOpen && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] text-white shadow-lg z-40 p-4 md:hidden"
        >
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <h2 className="text-lg font-bold">Меню</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <SidebarContent />
        </motion.div>
      )}
    </>
  );
};

const SidebarContent = () => (
  <nav className="mt-4">
    <ul className="space-y-4">
      <SidebarLink to="/all-portfolios" icon={<Briefcase size={20} />} text="Portfolios" />
      <li>
        <button
          onClick={() => (window.location.href = "https://ru.investing.com/news/stock-market-news")}
          className="flex items-center gap-3 p-3 text-gray-300 rounded-lg hover:bg-gray-800 transition w-full text-left"
        >
          <Newspaper size={20} />
          News
        </button>
      </li>
      {/* <SidebarLink to="/settings" icon={<Settings size={20} />} text="Settings" /> */}
    </ul>
  </nav>
);

const SidebarLink = ({ to, icon, text }) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-3 p-3 text-gray-300 rounded-lg hover:bg-gray-800 transition"
    >
      {icon}
      {text}
    </Link>
  </li>
);

export default Sidebar;