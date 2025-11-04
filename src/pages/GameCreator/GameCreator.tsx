import React, { useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GameCreator.module.css";
import Typography from "@shared/ui/Typography/Typography";
import { useTranslation } from "react-i18next";
import type { Difficulty, GameMode, GameState } from "src/types/game";
import Button from "@shared/ui/Button/Button";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { LOCALSTORAGE_GAME_NAME } from "@shared/constants/localStorageNames";
import { generateGameId } from "@shared/utils/gameHelpers";

type FormValues = {
  mode: GameMode;
  rows: number;
  columns: number;
  winCondition: number;
  difficulty: Difficulty;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

function getFormValues(fd: FormData | null): FormValues {
  const rawMode = (fd?.get("mode") as string) || "local";
  const rawRows = Number(fd?.get("rows") ?? 6);
  const rawColumns = Number(fd?.get("columns") ?? 7);
  const rows = clamp(Number.isFinite(rawRows) ? Math.trunc(rawRows) : 6, 4, 10);
  const columns = clamp(
    Number.isFinite(rawColumns) ? Math.trunc(rawColumns) : 7,
    4,
    10
  );
  const maxWin = Math.min(rows, columns);
  const rawWin = Number(fd?.get("winCondition") ?? 4);
  const winCondition = clamp(
    Number.isFinite(rawWin) ? Math.trunc(rawWin) : 4,
    3,
    maxWin
  );
  const difficulty = ((fd?.get("difficulty") as string) ||
    "easy") as Difficulty;

  return {
    mode: rawMode === "bot" ? "bot" : "local",
    rows,
    columns,
    winCondition,
    difficulty,
  };
}

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [selectedMode, setSelectedMode] = React.useState<GameMode>("local");

  const { t } = useTranslation("create");

  const [gameState] = useLocalStorage<{
    [key: string]: GameState;
  }>(LOCALSTORAGE_GAME_NAME, {});

  const currentOnGoingGame: GameState | null = useMemo(() => {
    const first = Object.values(gameState ?? {})[0];
    return first && first.isGameOver === false ? first : null;
  }, [gameState]);

  const handleStartGame = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      const form = formRef.current;
      const fd = form ? new FormData(form) : null;

      const values = getFormValues(fd);

      const gameId = generateGameId();

      navigate(`/game/${gameId}`, {
        state: values,
      });
    },
    [navigate]
  );

  return (
    <div className="centered">
      {currentOnGoingGame !== null && (
        <div className={styles.resumeBanner}>
          <Typography.H2>{t("resume.message")}</Typography.H2>
          <Button
            className={styles.resumeLink}
            variant="secondary"
            onClick={() =>
              navigate(`/game/${currentOnGoingGame.id}`, {
                state: {
                  mode: currentOnGoingGame.mode,
                  rows: currentOnGoingGame.board.length,
                  columns: currentOnGoingGame.board[0].length,
                  winCondition: currentOnGoingGame.winCondition ?? 4,
                  difficulty: currentOnGoingGame.difficulty ?? "easy",
                },
              })
            }
          >
            {t("resume.continue")}
          </Button>
        </div>
      )}

      <Typography.H1>{t("title")}</Typography.H1>
      <form
        ref={formRef}
        onSubmit={handleStartGame}
        className={styles.createGame}
      >
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            {t("mode.title")}
          </Typography.H2>
          <div className={styles.modeSwitch}>
            <label
              className={`${styles.modeButton} ${
                selectedMode === "local" ? styles.active : ""
              }`}
            >
              <input
                type="radio"
                name="mode"
                value="local"
                checked={selectedMode === "local"}
                onChange={() => setSelectedMode("local")}
                style={{ display: "none" }}
              />
              <Typography.ButtonText>{t("mode.local")}</Typography.ButtonText>
            </label>

            <label
              className={`${styles.modeButton} ${
                selectedMode === "bot" ? styles.active : ""
              }`}
            >
              <input
                type="radio"
                name="mode"
                value="bot"
                checked={selectedMode === "bot"}
                onChange={() => setSelectedMode("bot")}
                style={{ display: "none" }}
              />
              <Typography.ButtonText>{t("mode.bot")}</Typography.ButtonText>
            </label>
          </div>
        </div>
        {selectedMode === "bot" && (
          <div className={styles.section}>
            <Typography.H2 className={styles.sectionTitle}>
              {t("difficulty.title")}
            </Typography.H2>
            <div className={styles.difficultySwitch}>
              <label className={styles.difficultyButton}>
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  defaultChecked
                  style={{ display: "none" }}
                />
                <Typography.ButtonText>
                  {t("difficulty.easy")}
                </Typography.ButtonText>
              </label>

              <label className={styles.difficultyButton}>
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  style={{ display: "none" }}
                />
                <Typography.ButtonText>
                  {t("difficulty.medium")}
                </Typography.ButtonText>
              </label>

              <label className={styles.difficultyButton}>
                <input
                  type="radio"
                  name="difficulty"
                  value="insane"
                  style={{ display: "none" }}
                />
                <Typography.ButtonText>
                  {t("difficulty.insane")}
                </Typography.ButtonText>
              </label>
            </div>
          </div>
        )}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            {t("board.title")}
          </Typography.H2>
          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <Typography.Label>{t("board.rows")}</Typography.Label>
              <input
                type="number"
                name="rows"
                min={4}
                max={10}
                defaultValue={6}
                className={styles.numberInput}
              />
            </div>
            <div className={styles.inputField}>
              <Typography.Label>{t("board.columns")}</Typography.Label>
              <input
                type="number"
                name="columns"
                min={4}
                max={10}
                defaultValue={7}
                className={styles.numberInput}
              />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            {t("pieces.title")}
          </Typography.H2>
          <div className={styles.inputField}>
            <input
              type="number"
              name="winCondition"
              min={3}
              max={10}
              defaultValue={4}
              className={styles.numberInput}
            />
          </div>
        </div>

        <Button type="submit" variant="primary">
          {t("start")}
        </Button>
      </form>
    </div>
  );
};

export default CreateGame;
