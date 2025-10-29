import React, { memo, useCallback } from "react";
import styles from "./GameInfo.module.css";
import Typography from "@shared/ui/Typography/Typography";
import type { Player, GameMode } from "src/types/game";
import { getPlayerColor, getPlayerName } from "@shared/utils/gameHelpers";
import { useTranslation } from "react-i18next";
import Button from "@shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { generateGameId } from "@shared/utils/gameHelpers";

interface GameInfoProps {
  currentPlayer: Player;
  winner: Player | "draw" | null;
  mode: GameMode;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
}

const GameInfo: React.FC<GameInfoProps> = memo(
  ({ currentPlayer, mode, winner }) => {
    const { t } = useTranslation("game");
    const navigate = useNavigate();
    const startNewGame = useCallback(() => {
      const gameId = generateGameId();
      navigate(`/game/${gameId}`);
    }, [navigate]);

    const currentPlayerName = getPlayerName(currentPlayer, mode);
    const currentPlayerColor = getPlayerColor(currentPlayer);

    return (
      <div className={styles.gameInfo}>
        <div className={styles.status}>
          {winner === "draw" ? (
            <div className={styles.finishedRow}>
              <Typography.H2 className={styles.draw}>{t("draw")}</Typography.H2>
              <Button
                variant="secondary"
                onClick={startNewGame}
                className={styles.newGameButton}
              >
                {t("newGame")}
              </Button>
            </div>
          ) : winner ? (
            <div className={styles.finishedRow}>
              <Typography.H2 className={styles.winner}>
                {t("won")}{" "}
                <Typography.Label
                  className={styles.playerName}
                  style={{ color: getPlayerColor(winner) }}
                >
                  {getPlayerName(winner, mode)}
                </Typography.Label>
                !
              </Typography.H2>
              <Button
                variant="secondary"
                onClick={startNewGame}
                className={styles.newGameButton}
              >
                {t("newGame")}
              </Button>
            </div>
          ) : (
            <Typography.H2>
              {t("turn")}{" "}
              <Typography.Label
                className={styles.playerName}
                style={{ color: currentPlayerColor }}
              >
                {currentPlayerName}
              </Typography.Label>
            </Typography.H2>
          )}
        </div>
      </div>
    );
  }
);

GameInfo.displayName = "GameInfo";

export default GameInfo;
