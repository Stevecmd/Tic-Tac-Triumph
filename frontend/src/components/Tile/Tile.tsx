
import { useAppContext, Score } from "contexts/AppContext";

import {
  DRAW_STATE,
  O_WINS_STATE,
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
    setWinner,
    score,
    setScore,
    allPlayers,
  } = useAppContext();

  interface Player {
    socket_id: string;
    // Add other properties of the activePlayer object here
  }
  
  const isDisabled = tiles[index] !== null || gameState !== PROGRESS_STATE;

 function onClick() {
   if (isDisabled) return;
    if (activePlayer && (activePlayer as Player).socket_id == socket?.id) {
     
   
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
      setActivePlayer(player || null)

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
        const win = value1 === PLAYER_X ? X_WINS_STATE : O_WINS_STATE;
        let win_icon = ""
        const newScore: Score = { ...score };
        if (win == 0) {
          newScore.X += 1;
          win_icon = "X"
        }
        else if (win == 1) {
          newScore.O += 1;  
          win_icon = "O"
        }
        else {
            newScore.draw += 1; 
        }
        const player = allPlayers?.find((player) => player.icon == win_icon)
        if (player && player !== null) {
          setActivePlayer(player)
          console.log(player.icon, playerTurn)
        }
        socket?.emit("GameWon", player)
        
        setScore(newScore)

        setGameState(win);
        setWinner(value1);
        setStrikeClass(strikeClass);
        return;
      }
    }

    const areAllTilesFilledIn = tiles.every((tile) => tile);
    if (areAllTilesFilledIn) {
      setGameState(DRAW_STATE);
      setWinner("Draw");
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