import { useEffect } from "react";

import Board from "components/Board/Board";
import Reset from "components/Reset/Reset";

import PlayerStatus from "components/PlayerStatus/PlayerStatus";
import ScoreBoard from "components/ScoreBoard/ScoreBoard";
import EndGameModal from "components/EndGameModal/EndGameModal";

import gameOverSoundAsset from "sounds/game_over.mp3";

import { X_WINS_STATE, O_WINS_STATE, PROGRESS_STATE } from "utils/constants";
import { useAppContext } from "contexts/AppContext";

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;

import "./style.css";

function TicTacToe() {
  const { gameState, socket, waitingForPlayer } = useAppContext();

  useEffect(() => {
    if (gameState === X_WINS_STATE || gameState === O_WINS_STATE) {
      gameOverSound.play();
    }
  }, [gameState, socket]);

  if (waitingForPlayer) {
    return (
      <div className="tictactoe">
        <div className="waiting-message">Waiting for player...</div>
      </div>
    );
  }

  return (
    <div className="tictactoe">
      <Board />
      <Reset />
      <PlayerStatus />
      <ScoreBoard />
      {gameState !== PROGRESS_STATE ? <EndGameModal /> : null}
    </div>
  );
}
export default TicTacToe;
