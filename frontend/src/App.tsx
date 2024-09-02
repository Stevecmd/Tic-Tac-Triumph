import { useEffect, useState } from "react";
import { Player, Score } from "contexts/AppContext";

import TicTacToe from "components/TicTacToe";
import { AppContext, AppContextType } from "contexts/AppContext";

import { PLAYER_X, PROGRESS_STATE } from "utils/constants";
import { io, Socket } from "socket.io-client";

import "styles/base.css";
import "./style.css";
import clickSoundFile from "sounds/button-17.wav";

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
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draw: 0 });
  const [waitingForPlayer, setWaitingForPlayer] = useState<boolean>(false);


  useEffect(() => {
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    const clickSound = new Audio(clickSoundFile);
    clickSound.volume = 0.5;

    newSocket.on("connect", () => {
      // console.log("Connected to the server:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      // console.log("Disconnected from the server");
    });

    newSocket.emit("joinRoom");

    newSocket.on("playerJoined", (player) => { 
      console.log(`Player ${player.socket_id} joined room ${player.room_id}`);
    });

    newSocket.on("StartGame", (players) => {
      setAllPlayers(players);
      const player = players.find(
        (player: { socket_id: string | undefined }) => {
          return player.socket_id === newSocket.id;
        }
      );
      if (!player) {
        console.log("Player not found in room");
        return;
      }
      if (!activePlayer) {
        setActivePlayer(players[0]);
        setPlayerTurn(players[0].player_icon); // Ensure X always starts first
      }
      setWaitingForPlayer(false);

      // set the current player if not already set
      if(!currentPlayer) setCurrentPlayer(player);

      // Reset the game state when a new game starts
      setGameState(PROGRESS_STATE);
      setTiles(Array(9).fill(null));
      setActivePlayer(players[0]);
      setPlayerTurn(players[0].player_icon);
      setStrikeClass("");
    });

    newSocket.on("waitingForPlayer", (player) => {
      // set the active player, player turn and current player
      setActivePlayer(player);
      setPlayerTurn(player.player_icon);
      setWaitingForPlayer(true);
      setCurrentPlayer(player);
    });

    newSocket.on("moves", (data) => {
      setTiles(data.tiles);
      setActivePlayer(data.player);
      setPlayerTurn(data.player.player_icon);
      
      if (data.player.socket_id === newSocket.id) {
        clickSound.play()
      };
    });

    newSocket.on("resetGame", (player, text) => {
      setGameState(PROGRESS_STATE);
      setTiles(Array(9).fill(null));
      setPlayerTurn(player.player_icon);
      setActivePlayer(player);
      setStrikeClass("");
      if(text == "Reset") {
        setScore({X: 0, O: 0, draw: 0})
      }
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

    allPlayers,
    setAllPlayers,

    score,
    setScore,

    waitingForPlayer,
    setWaitingForPlayer,
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
