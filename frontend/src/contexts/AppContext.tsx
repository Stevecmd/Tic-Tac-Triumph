import { useContext, createContext } from "react";
import { Socket } from "socket.io-client";

// Define the type for a player
export type Player = {
  socket_id: string;
  player_icon: string;
  room_id: number;
};

export interface Score {
  X: number;
  O: number;
  draw: number;
}
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
  currentPlayer: Player | null;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  activePlayer: Player | null;
  setActivePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  allPlayers: Player[] | null;
  setAllPlayers: React.Dispatch<React.SetStateAction<Player[] | null>>;
  score: Score;
  setScore: React.Dispatch<React.SetStateAction<Score>>;
  waitingForPlayer: boolean;
  setWaitingForPlayer: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw Error("useAppContext must be used within AppContext Provider");
  }

  return context;
};
