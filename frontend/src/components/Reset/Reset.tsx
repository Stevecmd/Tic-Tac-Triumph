import { PROGRESS_STATE, } from "utils/constants";
import { useAppContext } from "contexts/AppContext";

import "./style.css";

function Reset() {
  
  const {
    setTiles,
    setStrikeClass,
    gameState,
    setGameState,
    socket,
    activePlayer,
  } = useAppContext();

   const text = gameState === PROGRESS_STATE ? "Reset" : "Play Again";

  function onClick() {
    setGameState(PROGRESS_STATE);
    setTiles(Array(9).fill(null));
    setStrikeClass("");

    if (socket) {
      socket.emit("resetGame", activePlayer, text);
    }
  }

 
 

  return (
    <button onClick={onClick} className="reset-button">
      {text}
    </button>
  );
}

export default Reset;
