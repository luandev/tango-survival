import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [isGameComplete, setIsGameComplete] = useState(false);

  return (
    <GameContext.Provider value={{ isGameComplete, setIsGameComplete }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
