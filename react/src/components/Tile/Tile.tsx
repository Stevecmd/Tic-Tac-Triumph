import { useAppContext } from "contexts/AppContext";
import {
  DRAW_STATE,
  O_WINS_STATE,
  PLAYER_O,
  PLAYER_X,
  PROGRESS_STATE,
  WIN_COMBOS,
  X_WINS_STATE,
} from "utils/constants";
import clickSoundFile from "sounds/mouse_click.mp3";

import "./style.css";

const clickSound = new Audio(clickSoundFile);
clickSound.volume = 0.4;

function Tile({ index }: { index: number }) {
  const {
    tiles,
    setTiles,
    playerTurn,
    setPlayerTurn,
    gameState,
    setGameState,
    setStrikeClass,
    socket,
    activePlayer,
    setActivePlayer,
  } = useAppContext();

  const isDisabled = tiles[index] !== null || gameState !== PROGRESS_STATE;

 function onClick() {
   if (isDisabled) return;
   if (activePlayer && activePlayer.socket_id == socket.id) {
     
   
     const newTiles = [...tiles];
     newTiles[index] = activePlayer.icon;
     setTiles(newTiles);

     setPlayerTurn(activePlayer.icon);

     socket!.emit("playerMove", { ID: 1 }, { tiles: newTiles });
     listenMoves()
   }
   else {
        console.log("not eligible to play icon", playerTurn)
      }
  }

 

  function listenMoves() {
    socket!.on("moves", (data, player) => {
      console.log(player)
          setActivePlayer(player)
          clickSound.play();
          checkWinner(data.tiles);
        });
  }
    
  
 

  function checkWinner(tiles: (string | null)[]) {
    for (const { combo, strikeClass } of WIN_COMBOS) {
      const value1 = tiles[combo[0]];
      const value2 = tiles[combo[1]];
      const value3 = tiles[combo[2]];

      if (value1 && value1 === value2 && value1 === value3) {
        setStrikeClass(strikeClass);

        const win = value1 === PLAYER_X ? X_WINS_STATE : O_WINS_STATE;
        setGameState(win);
        return;
      }
    }

    const areAllTilesFilledIn = tiles.every((tile) => tile);
    if (areAllTilesFilledIn) {
      setGameState(DRAW_STATE);
    }
  }

  return (
    <button
      onClick={onClick}
      className="tile"
      data-player={playerTurn}
      disabled={isDisabled}
    >
      {tiles[index]}
    </button>
  );
}

export default Tile;
