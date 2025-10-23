import React, { memo } from "react";
import styles from "./GameInfo.module.css";
import type { Player, GameMode } from "src/types/game";
import { getPlayerColor, getPlayerName } from "@shared/utils/gameHelpers";

interface GameInfoProps {
  currentPlayer: Player;
  winner: Player | "draw" | null;
  mode: GameMode;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
}

const GameInfo: React.FC<GameInfoProps> = memo(
  ({ currentPlayer, winner, mode, onReset, onModeChange }) => {
    const currentPlayerName = getPlayerName(currentPlayer, mode);
    const currentPlayerColor = getPlayerColor(currentPlayer);

    return (
      <div className={styles.gameInfo}>
        <div className={styles.status}>
          {winner === "draw" ? (
            <h2 className={styles.draw}>Ничья!</h2>
          ) : winner ? (
            <h2 className={styles.winner}>
              Победил{" "}
              <span style={{ color: getPlayerColor(winner) }}>
                {getPlayerName(winner, mode)}
              </span>
              !
            </h2>
          ) : (
            <h2>
              Ход:{" "}
              <span style={{ color: currentPlayerColor }}>
                {currentPlayerName}
              </span>
            </h2>
          )}
        </div>

        <div className={styles.controls}>
          <button className={styles.resetButton} onClick={onReset}>
            Новая игра
          </button>

          <div className={styles.modeSwitch}>
            <button
              className={`${styles.modeButton} ${
                mode === "local" ? styles.active : ""
              }`}
              onClick={() => onModeChange("local")}
            >
              2 игрока
            </button>
            <button
              className={`${styles.modeButton} ${
                mode === "bot" ? styles.active : ""
              }`}
              onClick={() => onModeChange("bot")}
              disabled
              title="Скоро..."
            >
              Против бота
            </button>
          </div>
        </div>
      </div>
    );
  }
);

GameInfo.displayName = "GameInfo";

export default GameInfo;
