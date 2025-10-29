import React, { memo } from "react";
import styles from "./GameInfo.module.css";
import Typography from "@shared/ui/Typography/Typography";
import type { Player, GameMode } from "src/types/game";
import { getPlayerColor, getPlayerName } from "@shared/utils/gameHelpers";
import { useTranslation } from "react-i18next";

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
    const currentPlayerName = getPlayerName(currentPlayer, mode);
    const currentPlayerColor = getPlayerColor(currentPlayer);

    return (
      <div className={styles.gameInfo}>
        <div className={styles.status}>
          {winner === "draw" ? (
            <Typography.H2 className={styles.draw}>{t("draw")}</Typography.H2>
          ) : winner ? (
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
