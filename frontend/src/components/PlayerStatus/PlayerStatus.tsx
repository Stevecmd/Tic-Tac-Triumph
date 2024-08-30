import { useAppContext } from 'contexts/AppContext';
import './style.css';

function PlayerStatus() {
  const { activePlayer } = useAppContext();

  return (
    <div className="player-status">
      <h2>Current Turn: Player {activePlayer?.icon}</h2>
    </div>
  );
}

export default PlayerStatus;