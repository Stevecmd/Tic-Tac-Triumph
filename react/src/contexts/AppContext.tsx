import { useContext, createContext } from "react";
import { Socket } from "socket.io-client";

export type AppContextType = {
  tiles: (string | null)[];
  setTiles: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  playerTurn: string;
  setPlayerTurn: React.Dispatch<React.SetStateAction<string>>;
  strikeClass: string;
  setStrikeClass: React.Dispatch<React.SetStateAction<string>>;
  gameState: number;
  setGameState: React.Dispatch<React.SetStateAction<number>>;
  socket: Socket | null;
  currentPlayer: (object | null);
  setCurrentPlayer: React.Dispatch<React.SetStateAction<object>>;
  activePlayer: (object | null);
  setActivePlayer: React.Dispatch<React.SetStateAction<object>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw Error("useAppContext must be used within AppContext Provider");
  }

  return context;
};
