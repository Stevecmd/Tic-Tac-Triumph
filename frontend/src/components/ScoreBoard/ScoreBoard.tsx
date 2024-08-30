import { useAppContext } from "contexts/AppContext";
import "./style.css";

function ScoreBoard() {
  const { score } = useAppContext();

  return (
    <div className="score-board">
      <div>Player X: {score.X}</div>
      <div>Player O: {score.O}</div>
      <div>Draw: {score.draw}</div>
    </div>
  );
}

export default ScoreBoard;
