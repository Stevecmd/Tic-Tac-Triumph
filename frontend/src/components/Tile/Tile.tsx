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
clickSound.volume = 0.5;

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
    currentPlayer,
    score,
    setScore,
    allPlayers,
  } = useAppContext();

  interface Player {
    socket_id: string;
    player_icon: string;
    room_id: number;
    // Add other properties of the activePlayer object here
  }

  const isDisabled = tiles[index] !== null || gameState !== PROGRESS_STATE;

  function onClick() {
    if (isDisabled) return;
    if (activePlayer && currentPlayer && (activePlayer as Player).socket_id == currentPlayer.socket_id) {
      const newTiles = [...tiles];
      newTiles[index] = activePlayer.player_icon;
      setTiles(newTiles);
      clickSound.play();
      socket!.emit("playerMove", {player: activePlayer, tiles:newTiles });
      listenMoves();
    }
  }

  function listenMoves() {
    socket!.on("moves", (data) => {
      setActivePlayer(data.player);
      setPlayerTurn(data.player.player_icon);
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
        let win_icon = "";
        const newScore: Score = { ...score };
        if (win == 0) {
          newScore.X += 1;
          win_icon = "X";
        } else if (win == 1) {
          newScore.O += 1;
          win_icon = "O";
        } else {
          newScore.draw += 1;
        }
        const player = allPlayers?.find((player) => player.player_icon == win_icon);
        const next_player = allPlayers?.find((player) => player.player_icon != win_icon);
        if (player && player !== null) {
          setActivePlayer(next_player || null);
        }
        socket?.emit("GameWon", player);

        setScore(newScore);

        setGameState(win);

        setStrikeClass(strikeClass);
        return;
      }
    }

    const areAllTilesFilledIn = tiles.every((tile) => tile);
    if (areAllTilesFilledIn) {
      setGameState(DRAW_STATE);
      const newScore: Score = { ...score };
      newScore.draw += 1;
      setScore(newScore);
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
