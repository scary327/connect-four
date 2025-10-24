import React, { memo } from "react";
import styles from "./GameInfo.module.css";
import Typography from "@shared/ui/Typography/Typography";
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
            <Typography.H2 className={styles.draw}>Ничья!</Typography.H2>
          ) : winner ? (
            <Typography.H2 className={styles.winner}>
              Победил{" "}
              <Typography.Label
                className={styles.playerName}
                style={{ color: getPlayerColor(winner) }}
              >
                {getPlayerName(winner, mode)}
              </Typography.Label>
              !
            </Typography.H2>
          ) : (
            <Typography.H2>
              Ход:{" "}
              <Typography.Label
                className={styles.playerName}
                style={{ color: currentPlayerColor }}
              >
                {currentPlayerName}
              </Typography.Label>
            </Typography.H2>
          )}
        </div>

        <div className={styles.controls}>
          <button className={styles.resetButton} onClick={onReset}>
            <Typography.ButtonText>Новая игра</Typography.ButtonText>
          </button>

          <div className={styles.modeSwitch}>
            <button
              className={`${styles.modeButton} ${
                mode === "local" ? styles.active : ""
              }`}
              onClick={() => onModeChange("local")}
            >
              <Typography.ButtonText>2 игрока</Typography.ButtonText>
            </button>
            <button
              className={`${styles.modeButton} ${
                mode === "bot" ? styles.active : ""
              }`}
              onClick={() => onModeChange("bot")}
              disabled
              title="Скоро..."
            >
              <Typography.ButtonText>Против бота</Typography.ButtonText>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

GameInfo.displayName = "GameInfo";

export default GameInfo;
