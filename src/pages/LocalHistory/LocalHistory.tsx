import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LocalHistory.module.css";
import Typography from "@shared/ui/Typography/Typography";
import Button from "@shared/ui/Button/Button";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { LOCALSTORAGE_GAME_NAME } from "@shared/constants/localStorageNames";
import type { GameState, Player } from "src/types/game";
import { getPlayerColor, getPlayerName } from "@shared/utils/gameHelpers";

const LocalHistory: React.FC = () => {
  const navigate = useNavigate();

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
        <Typography.H1>Local history</Typography.H1>
        <div className={styles.empty}>
          <Typography.Body>No saved games yet.</Typography.Body>
        </div>
      </div>
    );
  }

  return (
    <div className="centered">
      <Typography.H1>Local history</Typography.H1>
      <div className={styles.list}>
        {list.map((g) => {
          const title =
            g.mode === "bot"
              ? `Vs Bot (${g.difficulty ?? "easy"})`
              : "2 Players";
          const sizeText = `${g.board.length} × ${g.board[0]?.length ?? 0}`;
          const resultLabel =
            g.winner === "draw"
              ? "Draw"
              : g.winner
              ? g.winner === "player1"
                ? "Player 1"
                : "Player 2"
              : "Ongoing";

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
                <InfoItem label="Mode">{title}</InfoItem>
                <InfoItem label="Size">{sizeText}</InfoItem>
                <InfoItem label="To win">{g.winCondition ?? 4}</InfoItem>
                <InfoItem label="Result">{resultLabel}</InfoItem>
              </div>

              <div className={styles.right}>
                <Button
                  variant="secondary"
                  ariaLabel={`Open game ${g.id}`}
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
