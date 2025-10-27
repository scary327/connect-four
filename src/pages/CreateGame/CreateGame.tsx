import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateGame.module.css";
import Typography from "@shared/ui/Typography/Typography";
import type { GameMode } from "src/types/game";
import Button from "@shared/ui/Button/Button";

type Difficulty = "easy" | "medium" | "hard" | "insane";

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

  const handleStartGame = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      const form = formRef.current;
      const fd = form ? new FormData(form) : null;

      const values = getFormValues(fd);

      const gameId = Date.now().toString();

      navigate(`/game/${gameId}`, {
        state: values,
      });
    },
    [navigate]
  );

  return (
    <div className="centered">
      <Typography.H1>Create Game</Typography.H1>

      <form
        ref={formRef}
        onSubmit={handleStartGame}
        className={styles.createGame}
      >
        {/* Game mode */}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            Game mode
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
              <Typography.ButtonText>2 Players</Typography.ButtonText>
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
              <Typography.ButtonText>Vs Bot</Typography.ButtonText>
            </label>
          </div>
        </div>

        {/* Bot difficulty - показываем только если выбран режим bot */}
        {selectedMode === "bot" && (
          <div className={styles.section}>
            <Typography.H2 className={styles.sectionTitle}>
              Bot difficulty
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
                <Typography.ButtonText>Easy</Typography.ButtonText>
              </label>

              <label className={styles.difficultyButton}>
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  style={{ display: "none" }}
                />
                <Typography.ButtonText>Medium</Typography.ButtonText>
              </label>

              <label className={styles.difficultyButton}>
                <input
                  type="radio"
                  name="difficulty"
                  value="insane"
                  style={{ display: "none" }}
                />
                <Typography.ButtonText>Insane</Typography.ButtonText>
              </label>
            </div>
          </div>
        )}

        {/* Board size */}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            Board size
          </Typography.H2>
          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <Typography.Label>Rows:</Typography.Label>
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
              <Typography.Label>Columns:</Typography.Label>
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

        {/* Win condition */}
        <div className={styles.section}>
          <Typography.H2 className={styles.sectionTitle}>
            Pieces to win
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
          Start Game
        </Button>
      </form>
    </div>
  );
};

export default CreateGame;
