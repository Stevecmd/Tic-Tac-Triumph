import Strike from "components/Strike/Strike";
import Tile from "components/Tile/Tile";

import { useAppContext } from "contexts/AppContext";

import "./style.css";

function Board() {
  const { tiles } = useAppContext();

  return (
    <div className="board">
      {tiles.map((_, index) => (
        <Tile key={index} index={index} />
      ))}
      <Strike />
    </div>
  );
}

export default Board;
