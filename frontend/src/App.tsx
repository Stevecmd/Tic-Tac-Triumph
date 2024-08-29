import { useEffect, useState } from "react";

import TicTacToe from "components/TicTacToe";
import { AppContext, AppContextType, Player } from "contexts/AppContext";
import { PLAYER_X, PROGRESS_STATE } from "utils/constants";
import { io, Socket } from "socket.io-client";

import "styles/base.css";
import "./style.css";

function App() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState("");
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [gameState, setGameState] = useState(PROGRESS_STATE);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    newSocket.emit("joinRoom", { ID: 1 });

    newSocket.on("StartGame", (players: Player[]) => {
      const player = players.find((player) => {
        return player.socket_id === newSocket.id;
      });

      if (!player) return;

      if (!activePlayer) {
        setActivePlayer(player);
        setPlayerTurn(player.icon);
      }
    });

    newSocket.on("moves", (data) => {
      console.log(`received event from server`, data);
      setTiles(data.tiles);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const context: AppContextType = {
    tiles,
    setTiles,

    playerTurn,
    setPlayerTurn,

    strikeClass,
    setStrikeClass,

    gameState,
    setGameState,

    socket,

    activePlayer,
    setActivePlayer,
  };

  return (
    <AppContext.Provider value={context}>
      <div className="app">
        <TicTacToe />
      </div>
    </AppContext.Provider>
  );
}

export default App;
