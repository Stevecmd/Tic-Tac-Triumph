import { useAppContext } from 'contexts/AppContext';
import Reset from "components/Reset/Reset"
import './style.css';

function EndGameModal() {
  const { activePlayer } = useAppContext();

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{activePlayer ? `Player ${activePlayer.icon} Wins!` : "It's a Draw!"}</h2>
        <Reset/>
      </div>
    </div>
  );
}

export default EndGameModal;