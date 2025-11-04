import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LocalHistory.module.css";
import Typography from "@shared/ui/Typography/Typography";
import Button from "@shared/ui/Button/Button";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { LOCALSTORAGE_GAME_NAME } from "@shared/constants/localStorageNames";
import type { GameState, Player } from "src/types/game";
import { getPlayerColor, getPlayerName } from "@shared/utils/gameHelpers";
import { useTranslation } from "react-i18next";

const LocalHistory: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation("history");

  const InfoItem: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
  }) => (
    <div className={styles.infoItem}>
      <Typography.Label>{label}</Typography.Label>
      <Typography.Body>{children}</Typography.Body>
    </div>
  );

  const [games] = useLocalStorage<{ [key: string]: GameState }>(
    LOCALSTORAGE_GAME_NAME,
    {}
  );

  const getGameInfo = (g: GameState) => {
    const title =
      g.mode === "bot"
        ? t("status.vsBot", { difficulty: g.difficulty ?? "easy" })
        : "2 Players";
    const sizeText = `${g.board.length} × ${g.board[0]?.length ?? 0}`;
    const resultLabel =
      g.winner === "draw"
        ? t("status.draw")
        : g.winner
        ? g.mode === "bot"
          ? getPlayerName(g.winner as Player, "bot")
          : g.winner === "player1"
          ? t("status.player1")
          : t("status.player2")
        : t("status.ongoing");

    return { title, sizeText, resultLabel };
  };

  const list = useMemo(() => {
    const values = Object.values(games ?? {});
    return values.sort((a, b) => {
      const na = Number(a.id);
      const nb = Number(b.id);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
      return 0;
    });
  }, [games]);

  if (!list.length) {
    return (
      <div className="centered">
        <Typography.H1>{t("title")}</Typography.H1>
        <div className={styles.empty}>
          <Typography.Body>{t("empty")}</Typography.Body>
        </div>
      </div>
    );
  }

  return (
    <div className="centered">
      <Typography.H1>{t("title")}</Typography.H1>
      <div className={styles.list}>
        {list.map((g) => {
          const { title, sizeText, resultLabel } = getGameInfo(g);

          return (
            <div
              key={g.id}
              className={`${styles.card} ${
                g.isGameOver ? styles.finished : ""
              }`}
            >
              <div className={styles.winnerCol}>
                {g.isGameOver ? (
                  g.winner === "draw" ? (
                    <div className={styles.winnerBadge}>
                      <Typography.Body>Draw</Typography.Body>
                    </div>
                  ) : (
                    (() => {
                      const winner = g.winner as Player;
                      return (
                        <div
                          className={styles.winnerBadge}
                          style={{ borderColor: getPlayerColor(winner) }}
                        >
                          <div
                            className={styles.winnerColor}
                            style={{ background: getPlayerColor(winner) }}
                          />
                          <Typography.Body>
                            {getPlayerName(winner, g.mode)}
                          </Typography.Body>
                        </div>
                      );
                    })()
                  )
                ) : (
                  <div className={styles.winnerBadgeOngoing}>
                    <Typography.Body>Ongoing</Typography.Body>
                  </div>
                )}
              </div>

              <div className={styles.infoCol}>
                <InfoItem label={t("labels.mode")}>{title}</InfoItem>
                <InfoItem label={t("labels.size")}>{sizeText}</InfoItem>
                <InfoItem label={t("labels.toWin")}>
                  {g.winCondition ?? 4}
                </InfoItem>
                <InfoItem label={t("labels.result")}>{resultLabel}</InfoItem>
              </div>

              <div className={styles.right}>
                <Button
                  variant="secondary"
                  ariaLabel={t("openGame", { id: g.id })}
                  onClick={() =>
                    navigate(`/game/${g.id}`, {
                      state: {
                        mode: g.mode,
                        rows: g.board.length,
                        columns: g.board[0]?.length ?? 0,
                        winCondition: g.winCondition ?? 4,
                        difficulty: g.difficulty ?? "easy",
                      },
                    })
                  }
                >
                  →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocalHistory;
