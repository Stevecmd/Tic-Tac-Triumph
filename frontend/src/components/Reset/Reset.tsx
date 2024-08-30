import { PROGRESS_STATE, PLAYER_X } from "utils/constants";
import { useAppContext } from "contexts/AppContext";

import "./style.css";

function Reset() {
  const {
    setTiles,
    setPlayerTurn,
    setStrikeClass,
    gameState,
    setGameState,
    socket,
  } = useAppContext();

  function onClick() {
    setGameState(PROGRESS_STATE);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass("");

    if (socket) {
      socket.emit("resetGame", { ID: 1 });
    }
  }

  const text = gameState === PROGRESS_STATE ? "Reset" : "Play Again";

  return (
    <button onClick={onClick} className="reset-button">
      {text}
    </button>
  );
}

export default Reset;
