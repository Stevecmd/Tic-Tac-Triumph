import { useAppContext } from "contexts/AppContext";

import "./style.css";

function PlayerStatus() {
  const { activePlayer, currentPlayer } = useAppContext();
 
  if (activePlayer && currentPlayer) {
    const player_status = activePlayer.player_icon == currentPlayer.player_icon;
    const next_player = player_status ? "You" : `Player ${activePlayer?.player_icon}`;

    return (
      <div className="player-status">
        <h2>Current Turn: {next_player}</h2>
      </div>
  );
  }
  
}
export default PlayerStatus;
