import Strike from "components/Strike/Strike";
import Tile from "components/Tile/Tile";

import { useAppContext } from "contexts/AppContext";

import "./style.css";

function Board() {
  const { tiles } = useAppContext();

  return (
    <div>
      <header className="heading">
        <h2>Tic-Tac-Triumph</h2>
        <p>Board Game</p>
      </header>
    <div className="board">
      {tiles.map((_, index) => (
        <Tile key={index} index={index} />
      ))}
      <Strike />
      </div>
    </div>
  );
}

export default Board;
