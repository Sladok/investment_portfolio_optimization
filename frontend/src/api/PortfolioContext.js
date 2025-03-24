import { createContext, useState } from "react";

export const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);

  return (
    <PortfolioContext.Provider value={{ portfolios, setPortfolios }}>
      {children}
    </PortfolioContext.Provider>
  );
}
