import { useEffect } from "react";

import Board from "components/Board/Board";
import Reset from "components/Reset/Reset";

import gameOverSoundAsset from "sounds/game_over.mp3";

import { X_WINS_STATE, O_WINS_STATE } from "utils/constants";
import { useAppContext } from "contexts/AppContext";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;

import "./style.css";

function TicTacToe() {
  const { gameState, socket } = useAppContext();

  useEffect(() => {
    if (gameState === X_WINS_STATE || gameState === O_WINS_STATE) {
      gameOverSound.play();
    }
  }, [gameState, socket]);

  return (
    <div className="tictactoe">
      <Board />
      <Reset />
    </div>
  );
}

export default TicTacToe;
