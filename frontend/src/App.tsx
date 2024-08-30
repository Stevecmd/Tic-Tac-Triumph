import { useEffect, useState } from "react";
import { Player, Score } from 'contexts/AppContext'; 

import TicTacToe from "components/TicTacToe";
import { AppContext, AppContextType } from "contexts/AppContext";

import { PLAYER_X, PROGRESS_STATE } from "utils/constants";
import { io, Socket } from "socket.io-client";

import "styles/base.css";
import "./style.css";
const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

function App() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[] | null>(null);
  const [gameState, setGameState] = useState(PROGRESS_STATE);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState<boolean>(false);
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draw:0});

  useEffect(() => {
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    newSocket.emit("joinRoom", { ID: 1 });


    newSocket.on("StartGame", (players) => {
      setAllPlayers(players)
      const player = players.find((player: { socket_id: string | undefined; }) => {
        return player.socket_id === newSocket.id
      })
      if (!activePlayer || Object.keys(activePlayer).length === 0) {
        setActivePlayer(player);
        setPlayerTurn(PLAYER_X); // Ensure X always starts first
      }

      setWaitingForPlayer(false);

      // Reset the game state when a new game starts
      setGameState(PROGRESS_STATE);
      setTiles(Array(9).fill(null));
      setPlayerTurn(PLAYER_X);
      setStrikeClass("");
      setWinner(null);
    });

    newSocket.on("waitingForPlayer", () => {
      setWaitingForPlayer(true);
      // setCurrentPlayer(player)
    });
      


    newSocket.on("moves", (data) => {
      console.log(`received event from server`, data);
      setTiles(data.tiles);
    });

    newSocket.on("resetGame", () => {
      setGameState(PROGRESS_STATE);
      setTiles(Array(9).fill(null));
      setPlayerTurn(PLAYER_X);
      setStrikeClass("");
      setWinner(null);
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

    currentPlayer,
    setCurrentPlayer,

    activePlayer,
    setActivePlayer,

    winner,
    setWinner,

    waitingForPlayer,
    setWaitingForPlayer,

    allPlayers,
    setAllPlayers,

    score,
    setScore,


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
