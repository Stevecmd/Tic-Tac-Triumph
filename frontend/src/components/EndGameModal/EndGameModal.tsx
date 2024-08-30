import { useAppContext } from "contexts/AppContext";
import Reset from "components/Reset/Reset";
import { PLAYER_O, PLAYER_X } from "utils/constants";

import "./style.css";

function EndGameModal() {
  const { gameState } = useAppContext();

  let text = "It's a Draw!";

  if (gameState === 0) {
    text = `Player ${PLAYER_X} Wins!`;
  }
  if (gameState === 1) {
    text = `Player ${PLAYER_O} Wins!`;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{text}</h2>
        <Reset />
      </div>
    </div>
  );
}
export default EndGameModal;
